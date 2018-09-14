import 'reflect-metadata';
import {Injector} from 'injection-js';
import {REFRESH_TOKEN_MANAGER} from '../src/security.module';
import {RefreshTokenInterface, RefreshTokenManagerInterface} from '../src/interfaces';
import {Token} from '../src/models/token';
import {User} from '../src/models/user';
import {RefreshToken} from '../src/models/refresh-token';
import {UnauthorizedException} from '@rxstack/exceptions';
import {Application} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';


describe('Security:RefreshToken', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector = null;
  let authToken: Token;
  let refreshToken: RefreshTokenInterface;
  let manager: RefreshTokenManagerInterface;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    manager = injector.get<RefreshTokenManagerInterface>(REFRESH_TOKEN_MANAGER);
    authToken = new Token('token');
    authToken.setUser(new User('admin', 'admin', ['ADMIN']));
  });

  after(async() =>  {
    await app.stop();
  });

  it('should create a token', async () => {
    refreshToken = await manager.create(authToken);
    refreshToken.should.be.instanceOf(RefreshToken);
    (typeof refreshToken.toString()).should.be.equal('string');
    let cnt = await manager.count();
    cnt.should.be.equal(1);
  });

  it('should count tokens', async () => {
    let cnt = await manager.count();
    cnt.should.be.equal(1);
  });

  it('should check if a token exists', async () => {
    const check = await manager.has(refreshToken.toString());
    check.should.be.true;
  });

  it('should retrieve a token', async () => {
    const token = await manager.get(refreshToken.toString());
    token.should.be.instanceOf(RefreshToken);
  });

  it('should refresh a token', async () => {
    const refreshed = await manager.refresh(refreshToken);
    refreshed.should.be.equal('generated-token');
  });

  it('should disable a token', async () => {
    await manager.disable(refreshToken);
    let cnt = await manager.count();
    cnt.should.be.equal(0);
  });

  it('should throw an exception if token is not vaid', async () => {
    let exception;
    try {
      await manager.refresh(refreshToken);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should remove all tokens', async () => {
    await manager.create(authToken);
    await manager.clear();
    let cnt = await manager.count();
    cnt.should.be.equal(0);
  });
});
