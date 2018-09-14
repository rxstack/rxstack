import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWithoutRsa} from './environments/environment.without-rsa';
import {KeyLoader} from '../src/services';
import {jwt_app_options} from './mocks/jwt-app-options';
import {KeyType} from '../src/interfaces';

describe('KeyLoaderWithoutRsa', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWithoutRsa));
  let injector: Injector = null;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should load public key', async () => {
    const key = await injector.get(KeyLoader).loadKey(KeyType.PRIVATE_KEY);
    key.should.be.equal('my_secret');
  });

  it('should load private key', async () => {
    const key = await injector.get(KeyLoader).loadKey(KeyType.PUBLIC_KEY);
    key.should.be.equal('my_secret');
  });
});
