import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWithoutRsa} from './environments/environment.without-rsa';
import {TOKEN_ENCODER} from '../src';
import {jwt_app_options} from './mocks/jwt-app-options';

describe('TokenEncoderWithRsa', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWithoutRsa));
  let injector: Injector;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should encode', async () => {
    const encoder = injector.get(TOKEN_ENCODER);
    const encoded = await encoder.encode({'key': 'value'});
    const decoded = await encoder.decode(encoded);
    expect(decoded.hasOwnProperty('key')).toBeTruthy();
    expect(decoded.hasOwnProperty('iss')).toBeTruthy();
    expect(decoded.hasOwnProperty('iat')).toBeTruthy();
    expect(decoded.hasOwnProperty('exp')).toBeTruthy();
  });
});
