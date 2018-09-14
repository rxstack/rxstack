import {Injectable} from 'injection-js';
import {AbstractServer} from './abstract-server';
import {HttpDefinition, Transport} from '../kernel';
import {ServerEvents} from './server-events';
import {ServerConfigurationEvent} from './server-configuration.event';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import * as http from 'http';

@Injectable()
export class NoopHttpServer extends AbstractServer {

  getName(): string {
    return 'noop-http';
  }

  getTransport(): Transport {
    return 'HTTP';
  }

  protected async configure(routeDefinitions: HttpDefinition[]): Promise<void> {
    this.httpServer = http.createServer();
    this.engine = 'http engine';
    this.host = 'localhost';
    this.port = 3000;

    await this.injector.get(AsyncEventDispatcher)
      .dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this));
  }
}