import 'reflect-metadata';
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

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
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
    response.content.token.should.be.equal('generated-token');
    (typeof response.content.refreshToken).should.be.equal('string');
    refreshToken = response.content.refreshToken;
    request.token.isFullyAuthenticated().should.be.equal(true);
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
    exception.should.be.instanceOf(UserNotFoundException);
    exception.statusCode.should.be.equal(401);
  });

  it('should refresh token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_refresh_token');
    const request = new Request('HTTP');
    request.body = {
      'refreshToken': refreshToken
    };
    let response: Response = await def.handler(request);
    response.content.token.should.be.equal('generated-token');
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
    exception.should.be.instanceOf(NotFoundException);
  });

  it('should logout', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_logout');
    const request = new Request('HTTP');
    request.body = {
      'refreshToken': refreshToken
    };
    const response: Response = await def.handler(request);
    response.statusCode.should.be.equal(204);
    const refreshTokenObj = await injector.get(REFRESH_TOKEN_MANAGER).get(refreshToken);
    refreshTokenObj.expiresAt.should.equal(0);
  });

  it('should throw exception when logut without token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_logout');
    const request = new Request('HTTP');
    let exception: NotFoundException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(NotFoundException);
  });
});
