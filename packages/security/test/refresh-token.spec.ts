import 'reflect-metadata';
import {Injector} from 'injection-js';
import {REFRESH_TOKEN_MANAGER, RefreshTokenInterface} from '../src/interfaces';
import {UnauthorizedException} from '@rxstack/exceptions';
import {Application} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';
import * as _ from 'lodash';
import {AbstractRefreshTokenManager} from '../src/services';


describe('Security:RefreshToken', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector = null;
  let refreshToken: RefreshTokenInterface;
  let manager: AbstractRefreshTokenManager;

  before(async() =>  {
    injector = await app.run();
    manager = injector.get(REFRESH_TOKEN_MANAGER);
  });

  it('should create a token', async () => {
    refreshToken = await manager.create({});
    (typeof refreshToken).should.be.equal('object');
    _.has(refreshToken, '_id').should.be.equal(true);
  });

  it('should retrieve a token', async () => {
    const token = await manager.get(refreshToken._id);
    (typeof token).should.be.equal('object');
  });

  it('should refresh a token', async () => {
    const refreshed = await manager.refresh(refreshToken);
    refreshed.should.be.equal('generated-token');
  });

  it('should disable a token', async () => {
    await manager.disable(refreshToken);
    const token = await manager.get(refreshToken._id);
    token.expiresAt.should.be.equal(0);
  });

  it('should throw an exception if token is not valid', async () => {
    let exception;
    try {
      await manager.refresh(refreshToken);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should remove all tokens', async () => {
    await manager.create({});
    await manager.clear();
    const token = await manager.get(refreshToken._id);
    (!!token).should.be.equal(false);
  });
});
