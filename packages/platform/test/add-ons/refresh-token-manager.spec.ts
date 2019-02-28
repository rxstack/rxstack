import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {RefreshTokenManager} from '../../src/add-ons';

describe('Platform:Add-Ons:RefreshTokenManager', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  after(async() =>  {
    await app.stop();
  });

  it('should get refresh token', async () => {
    const token = await injector.get(RefreshTokenManager).get('id-1');
    (typeof token).should.be.equal('object');
  });

  it('should clear refresh token', async () => {
    const token = await injector.get(RefreshTokenManager).clear();
  });

  it('should persist new refresh token', async () => {
    const token = await injector.get(RefreshTokenManager).persist({
      identifier: 'id-2',
      username: 'admin-2',
      payload: {},
      expiresAt: 123
    });
    (typeof token).should.be.equal('object');
  });

  it('should persist with existing refresh token', async () => {
    const token = await injector.get(RefreshTokenManager).persist({
      identifier: 'id-1',
      username: 'admin-1',
      payload: {},
      expiresAt: 123
    });
    (typeof token).should.be.equal('object');
  });
});
