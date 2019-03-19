import * as express from 'express';
import * as http from 'http';
import {
  ErrorRequestHandler,
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse
} from 'express';
import * as bodyParser from 'body-parser';
import {
  Request, Response, HttpDefinition,
  AbstractServer, ServerConfigurationEvent, ServerEvents, Transport
} from '@rxstack/core';
import * as compress from 'compression';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ExpressServerConfiguration} from './express-server-configuration';
import {Injectable} from 'injection-js';
import {Stream} from 'stream';
import {exceptionToObject} from '@rxstack/exceptions';

@Injectable()
export class ExpressServer extends AbstractServer {

  static readonly serverName = 'express';

  getTransport(): Transport {
    return 'HTTP';
  }

  getName(): string {
    return ExpressServer.serverName;
  }

  protected async configure(routeDefinitions: HttpDefinition[]): Promise<void> {
    const configuration = this.injector.get(ExpressServerConfiguration);
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    this.host = configuration.host;
    this.port = configuration.port;
    this.engine = express();
    this.engine.use(compress());
    this.engine.use(bodyParser.json());
    this.engine.use(bodyParser.urlencoded({ extended: true }));

    await dispatcher
      .dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this));
    // register routes
    routeDefinitions.forEach(routeDefinition => this.registerRoute(routeDefinition, configuration));
    // important!!!
    this.engine.use(this.errorHandler());
    this.httpServer = http.createServer(<any>(this.engine));
  }

  private createRequest(req: ExpressRequest, routeDefinition: HttpDefinition): Request {
    const request = new Request('HTTP');
    request.path = routeDefinition.path;
    request.headers.fromObject(req.headers);
    request.params.fromObject(Object.assign(req.query, req.params));
    request.files.fromObject(req['files'] || {});
    request.body = req.body;
    return request;
  }

  private async registerRoute(routeDefinition: HttpDefinition, configuration: ExpressServerConfiguration): Promise<void> {
    const prefix: string = configuration.prefix;
    const path: string = prefix ? (prefix + routeDefinition.path) : routeDefinition.path;

    return this.engine[routeDefinition.method.toLowerCase()](path,
      async (req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> => {
        try {
          const response = await routeDefinition.handler(this.createRequest(req, routeDefinition));
          this.responseHandler(response, res);
        } catch (e) {
          this.errorHandler()(e, req, res, next);
        }
    });
  }

  private responseHandler(response: Response, res: ExpressResponse): void {
    response.headers.forEach((value, key) => res.header(key, value));
    res.status(response.statusCode);
    if (response.content instanceof Stream.Readable) {
      response.content.pipe(res);
    } else {
      res.send(response.content);
    }
  }

  private errorHandler(): ErrorRequestHandler {
    return (err: any, req: ExpressRequest, res: ExpressResponse, next: NextFunction): void => {
      const status = err.statusCode ? err.statusCode : 500;
      const transformedException = exceptionToObject(err, {status: status});
      if (status >= 500) {
        this.getLogger().error(err.message, transformedException);
      } else {
        this.getLogger().debug(err.message, transformedException);
      }

      if (process.env.NODE_ENV === 'production' && status >= 500) {
        res.status(status).send({
          'statusCode': status,
          'message': 'Internal Server Error'
        });
      } else {
        res.status(status).send(err);
      }
    };
  }
}