import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '../../src/application';
import {Injector} from 'injection-js';
import {NoopHttpServer, ServerEvents, ServerManager, ConnectionEvent} from '../../src/server';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {EventEmitter} from 'events';
import {ConnectionListener} from './fixtures/connection-listener';
import {SERVER_APP_OPTIONS} from './fixtures/server-app-options';

describe('Server', () => {
  // Setup application
  const app = new Application(SERVER_APP_OPTIONS);
  let injector: Injector;
  let manager: ServerManager;

  beforeAll(async () => {
    await app.start();
    injector = app.getInjector();
    manager = injector.get(ServerManager);
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should get server by name', async () => {
    const server = manager.getByName('noop-http');
    expect(server).toBeInstanceOf(NoopHttpServer);
  });

  it('should get http server', async () => {
    const server = manager.getByName('noop-http');
    expect(typeof server.getHttpServer() !== 'undefined').toBeTruthy();
  });

  it('should get engine', async () => {
    const server = manager.getByName('noop-http');
    expect(typeof server.getEngine() !== 'undefined').toBeTruthy();
  });

  it('should get host and port', async () => {
    const server = manager.getByName('noop-http');
    expect(server.getHost()).toBe('http://localhost:3000');
  });

  it('should get injector', async () => {
    const server = manager.getByName('noop-http');
    expect(typeof server.getInjector() !== 'undefined').toBeTruthy();
  });

  it('should dispatch onConnect event', async () => {
    const server = manager.getByName('noop-websocket');
    await injector.get(AsyncEventDispatcher)
      .dispatch(ServerEvents.CONNECTED, new ConnectionEvent(new EventEmitter(), server));
    expect(injector.get(ConnectionListener).connected).toBeTruthy();
  });
});
