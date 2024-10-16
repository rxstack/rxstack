import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWithoutRsa} from './environments/environment.without-rsa';
import {SecretLoader} from '../src/services';
import {jwt_app_options} from './mocks/jwt-app-options';
import {KeyType, SECRET_MANAGER} from '../src/interfaces';
import {ServiceRegistry} from '@rxstack/service-registry';

describe('SecretLoaderWithoutRsa', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWithoutRsa));
  let injector: Injector = null;
  let secretManager: ServiceRegistry<SecretLoader>;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    secretManager = injector.get(SECRET_MANAGER);
  });

  it('should load public key', async () => {
    const key = await secretManager.get('default').loadKey(KeyType.PRIVATE_KEY);
    expect(key).toBe('my_secret');
  });

  it('should load private key', async () => {
    const key = await secretManager.get('default').loadKey(KeyType.PUBLIC_KEY);
    expect(key).toBe('my_secret');
  });
});
