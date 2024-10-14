import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import { NotFoundException} from '@rxstack/exceptions';
import {REFRESH_TOKEN_MANAGER, UserNotFoundException} from '../src';
import {findHttpDefinition} from './helpers/kernel-definition-finder';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:HttpController', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector = null;
  let refreshToken: string;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should login', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_login');
    const request = new Request('HTTP');
    request.body = {
      username: 'admin',
      password: 'admin'
    };
    let response: Response = await def.handler(request);
    expect(response.content.token).toBe('generated-token');
    expect(typeof response.content.refreshToken).toBe('string');
    refreshToken = response.content.refreshToken;
    expect(request.token.isFullyAuthenticated()).toBeTruthy();
  });

  it('should not login', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_login');
    const request = new Request('HTTP');
    let exception: UserNotFoundException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(UserNotFoundException);
    expect(exception.statusCode).toBe(401);
  });

  it('should refresh token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_refresh_token');
    const request = new Request('HTTP');
    request.body = {
      'refreshToken': refreshToken
    };
    let response: Response = await def.handler(request);
    expect(response.content.token).toBe('generated-token');
  });

  it('should throw exception calling refresh token with invalid token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_refresh_token');
    const request = new Request('HTTP');
    let exception: NotFoundException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(NotFoundException);
  });

  it('should logout', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_logout');
    const request = new Request('HTTP');
    request.body = {
      'refreshToken': refreshToken
    };
    const response: Response = await def.handler(request);
    expect(response.statusCode).toBe(204);
    const refreshTokenObj = await injector.get(REFRESH_TOKEN_MANAGER).get(refreshToken);
    expect(refreshTokenObj.expiresAt).toBe(0);
  });

  it('should throw exception when logout without token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_logout');
    const request = new Request('HTTP');
    let exception: NotFoundException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(NotFoundException);
  });
});
