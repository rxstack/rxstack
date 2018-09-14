import {Injectable} from 'injection-js';
import {AbstractServer} from './abstract-server';
import {Transport, WebSocketDefinition} from '../kernel';
import {ServerConfigurationEvent} from './server-configuration.event';
import {ServerEvents} from './server-events';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import * as http from 'http';

@Injectable()
export class NoopWebsocketServer extends AbstractServer {

  getName(): string {
    return 'noop-websocket';
  }

  getTransport(): Transport {
    return 'SOCKET';
  }

  protected async configure(routeDefinitions: WebSocketDefinition[]): Promise<void> {
    this.httpServer = http.createServer();
    this.engine = 'socket engine';
    this.host = 'localhost';
    this.port = 3001;
    await this.injector.get(AsyncEventDispatcher)
      .dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this));
  }
}