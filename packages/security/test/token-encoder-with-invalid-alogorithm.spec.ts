import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWithInvalidAlgorithm} from './environments/environment.with-invalid-algorithm';
import {JWTEncodeFailureException} from '../src/exceptions';
import {TOKEN_ENCODER} from '../src';
import {jwt_app_options} from './mocks/jwt-app-options';

describe('TokenEncoderWithInvalidAlgorithm', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWithInvalidAlgorithm));
  let injector: Injector;

  before(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should encode', async () => {
    const encoder = injector.get(TOKEN_ENCODER);
    let exception: JWTEncodeFailureException;
    try {
      await encoder.encode({});
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(JWTEncodeFailureException);
  });
});
