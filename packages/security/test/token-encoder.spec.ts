import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {TokenEncoder} from '../src/services';
import {JWTDecodeFailureException} from '../src/exceptions';
import {environmentWitRsa} from './environments/environment.with-rsa';
import {jwt_app_options} from './mocks/jwt-app-options';
import {TOKEN_ENCODER} from '../src';

describe('TokenEncoder', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWitRsa));
  let injector: Injector = null;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should encode and decode', async () => {
    const encoder = injector.get(TOKEN_ENCODER);
    const encoded = await encoder.encode({'key': 'value'});
    const decoded = await encoder.decode(encoded);
    expect(decoded.hasOwnProperty('key')).toBeTruthy();
    expect(decoded.hasOwnProperty('iss')).toBeTruthy();
    expect(decoded.hasOwnProperty('iat')).toBeTruthy();
    expect(decoded.hasOwnProperty('exp')).toBeTruthy();
  });

  it('should throw an exception if token is invalid', async () => {
    const encoder = injector.get(TOKEN_ENCODER);
    let exception: JWTDecodeFailureException;
    try {
      await encoder.decode('invalid');
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(JWTDecodeFailureException);
  });
});
