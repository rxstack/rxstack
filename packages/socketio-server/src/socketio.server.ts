import * as http from 'http';
import {
  Request, Response, WebSocketDefinition,
  AbstractServer, ServerConfigurationEvent, ServerEvents, ConnectionEvent, Transport
} from '@rxstack/core';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Exception, exceptionToObject} from '@rxstack/exceptions';
import {Injectable} from 'injection-js';
import {SocketioServerConfiguration} from './socketio-server-configuration';
import {EventEmitter} from 'events';
import {Stream} from 'stream';

const winston = require('winston');
const io = require('socket.io');

@Injectable()
export class SocketioServer extends AbstractServer {

  static readonly serverName = 'socketio';

  getName(): string {
    return SocketioServer.serverName;
  }

  getTransport(): Transport {
    return 'SOCKET';
  }

  protected async configure(definitions: WebSocketDefinition[]): Promise<void> {
    const configuration = this.injector.get(SocketioServerConfiguration);
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    this.host = configuration.host;
    this.port = configuration.port;
    this.httpServer = http.createServer();
    this.engine = io(this.httpServer);
    this.engine.sockets.setMaxListeners(configuration.maxListeners);

    await dispatcher.dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this));

    this.engine.on('connection', async (socket: EventEmitter) => {
      this.setupSocket(socket, definitions);
      await dispatcher.dispatch(
        ServerEvents.CONNECTED,
        new ConnectionEvent(socket, this)
      );
      socket.on('disconnect', async () => {
        await dispatcher.dispatch(
          ServerEvents.DISCONNECTED,
          new ConnectionEvent(socket, this)
        );
      });
    });
  }

  private setupSocket(socket: EventEmitter, definitions: WebSocketDefinition[]): void {
    definitions.forEach(
      (definition) => this.registerRoute(definition, socket)
    );
  }

  private registerRoute(definition: WebSocketDefinition, socket: EventEmitter): void {
    socket.on(definition.name, async (args: any, callback?: () => void) => {
      try {
        const response = await definition.handler(this.createRequest(definition, socket, args));
        this.responseHandler(response, callback);
      } catch (e) {
        this.errorHandler(e, callback);
      }
    });
  }

  private createRequest(definition: WebSocketDefinition, socket: any, args: any): Request {
    args = args || {};
    const request = new Request('SOCKET');
    request.headers.fromObject(socket['request'].headers);
    request.params.fromObject(args.params || {});
    request.body = args.body;
    request.connection = socket;
    return request;
  }

  private responseHandler(response: Response, callback?: () => void): void {
    if (response.content instanceof Stream.Readable) {
      throw new Exception('Streaming is not supported.');
    }
    if (typeof callback === 'function') {
      callback.call(null, {
        'statusCode': response.statusCode,
        'headers': response.headers.toObject(),
        'content': response.content === undefined ? null : response.content,
      });
    }
  }

  private errorHandler(err: any, callback?: () => void) {
    err['statusCode'] = err['statusCode'] || 500;
    const transformedException = exceptionToObject(err, {status: err['statusCode']});
    const winstonMethod = err['statusCode'] >= 500 ? 'error' : 'debug';
    winston[winstonMethod](err.message, transformedException);
    if (typeof callback !== 'function') {
      return;
    }
    if (process.env.NODE_ENV === 'production' && err['statusCode'] >= 500) {
      callback.call(null, {message: 'Internal Server Error', statusCode: err['statusCode']});
    } else {
      callback.call(null, err);
    }
  }
}
