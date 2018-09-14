import * as http from 'http';
import {AbstractServer, ServerConfigurationEvent, ServerEvents, Transport, WebSocketDefinition} from '@rxstack/core';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Injectable} from 'injection-js';

@Injectable()
export class MockServer extends AbstractServer {

  getTransport(): Transport {
    return 'SOCKET';
  }

  getName(): string {
    return 'mock';
  }

  protected async configure(routeDefinitions: WebSocketDefinition[]): Promise<void> {
    this.host = 'localhost';
    this.port = 4242;
    this.engine = 'my engine';
    this.httpServer = http.createServer();
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    await dispatcher.dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this));
  }
}