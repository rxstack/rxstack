import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, ConnectionEvent, Kernel, Request, Response, ServerManager} from '@rxstack/core';
import {UnauthorizedException} from '@rxstack/exceptions';
import {findHttpDefinition} from './helpers/kernel-definition-finder';
import {ConnectionListener} from '../src/event-listeners/connection-listener';
import {EventEmitter} from 'events';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:Listeners', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector = null;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should set token in request and authenticate', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'test_index');
    const request = new Request('HTTP');
    request.params.set('bearer', 'generated-token');
    let response: Response = await def.handler(request);
    response.content.should.be.equal('admin');
  });

  it('should throw UnauthorizedException if user role does not match', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'test_index');
    const request = new Request('HTTP');
    let exception: UnauthorizedException;
    try {
      await def.handler(request);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        exception = e;
      }
    }
    (exception !== null).should.be.equal(true);
  });

  it('should throw UnauthorizedException if token is not valid', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'test_index');
    const request = new Request('HTTP');
    request.params.set('bearer', 'invalid');
    let exception: UnauthorizedException;
    try {
      await def.handler(request);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        exception = e;
      }
    }
    (exception !== null).should.be.equal(true);
  });

  it('should get anonymous token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'test_anon');
    const request = new Request('HTTP');
    const response: Response = await def.handler(request);
    response.content.username.should.be.equal('anon');
  });

  it('should remove token timeout on disconnect', async () => {
    const server = injector.get(ServerManager).getByName('noop-websocket');
    const connection = new EventEmitter();
    connection['tokenTimeout'] = setTimeout(() => {}, 5000);
    const listener = injector.get(ConnectionListener);
    const event = new ConnectionEvent(connection, server);
    await listener.onDisconnect(event);
    (null === connection['tokenTimeout']).should.be.equal(true);
  });
});
