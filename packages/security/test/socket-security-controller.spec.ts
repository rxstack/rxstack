import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {ForbiddenException, UnauthorizedException} from '@rxstack/exceptions';
import {EventEmitter} from 'events';
import {AnonymousToken, Token} from '../src/models';
import {findWebSocketDefinition} from './helpers/kernel-definition-finder';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:SocketController', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector = null;
  let token: string;
  let connection = new EventEmitter();

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should authenticate', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_authenticate');
    const request = new Request('SOCKET');
    request.connection = connection;
    request.params.set('bearer', 'generated-token');
    let response: Response = await def.handler(request);
    expect(response.statusCode).toBe(204);
    // @ts-ignore
    expect(request.connection['token']).toBeInstanceOf(Token);
    expect(request.token).toBeInstanceOf(Token);
  });

  it('should not authenticate with invalid token', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_authenticate');
    const request = new Request('SOCKET');
    request.connection = connection;
    request.params.set('bearer', 'invalid');
    let exception: UnauthorizedException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(UnauthorizedException);
  });

  it('should wait for the token timeout', (done) => {
    // @ts-ignore
    expect(typeof connection['tokenTimeout'] === 'object').toBeTruthy();
    setTimeout(() => {
      // @ts-ignore
      expect(connection['token']['fullyAuthenticated']).toBeFalsy();
      done();
    }, 1200);
  });

  it('should unauthenticate', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_unauthenticate');
    const request = new Request('SOCKET');
    request.connection = connection;
    let response: Response = await def.handler(request);
    expect(response.statusCode).toBe(204);
    // @ts-ignore
    expect(request.connection['token']).toBeInstanceOf(AnonymousToken);
  });


  it('should throw an exception on unauthenticate if user is not authenticated', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_unauthenticate');
    const request = new Request('SOCKET');
    request.connection = connection;
    let exception: ForbiddenException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(ForbiddenException);
  });
});
