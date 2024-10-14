import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWitRsa} from './environments/environment.with-rsa';
import {SecretLoader} from '../src/services';
import {jwt_app_options} from './mocks/jwt-app-options';
import {KeyType, SECRET_MANAGER} from '../src/interfaces';
import {ServiceRegistry} from '@rxstack/service-registry';

describe('SecretLoaderWithRsa', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWitRsa));
  let injector: Injector = null;
  let secretManager: ServiceRegistry<SecretLoader>;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    secretManager = injector.get(SECRET_MANAGER);
  });

  it('should load public key', async () => {
    await secretManager.get('default').loadKey(KeyType.PUBLIC_KEY);
    // key should be loaded from cache
    const key = await secretManager.get('default').loadKey(KeyType.PUBLIC_KEY);
    expect(typeof key).toBe('object');
  });

  it('should load private key', async () => {
    const key = await secretManager.get('default').loadKey(KeyType.PRIVATE_KEY);
    expect(typeof key).toBe('object');
  });
});
