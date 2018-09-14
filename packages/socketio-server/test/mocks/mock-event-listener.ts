import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents, ConnectionEvent} from '@rxstack/core';
import {Injectable, Injector} from 'injection-js';
import {socketMiddleware} from './socketio.middleware';
import {SocketioServer} from '../../src/socketio.server';
import {EventEmitter} from 'events';

@Injectable()
export class MockEventListener {

  connectedUsers: EventEmitter[] = [];

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @Observe(ServerEvents.CONFIGURE)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.server.getName() !== SocketioServer.serverName) {
      return;
    }
    event.server.getEngine()
      .use(socketMiddleware(this.injector))
    ;
  }

  @Observe(ServerEvents.CONNECTED)
  async onConnect(event: ConnectionEvent): Promise<void> {
    if (event.server.getName() !== SocketioServer.serverName) {
      return;
    }

    this.connectedUsers.push(event.connection);
    event.server.getEngine().emit('hi', 'all');
  }

  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: ConnectionEvent): Promise<void> {
    if (event.server.getName() !== SocketioServer.serverName) {
      return;
    }

    let idx = this.connectedUsers.findIndex((current) => current === event.connection);
    if (idx !== -1) {
      this.connectedUsers.splice(idx, 1);
    }
  }
}