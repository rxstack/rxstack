import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWithoutRsa} from './environments/environment.without-rsa';
import {TOKEN_ENCODER} from '../src';
import {jwt_app_options} from './mocks/jwt-app-options';

describe('TokenEncoderWithRsa', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWithoutRsa));
  let injector: Injector;

  before(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should encode', async () => {
    const encoder = injector.get(TOKEN_ENCODER);
    const encoded = await encoder.encode({'key': 'value'});
    const decoded = await encoder.decode(encoded);
    decoded.hasOwnProperty('key').should.be.equal(true);
    decoded.hasOwnProperty('iss').should.be.equal(true);
    decoded.hasOwnProperty('iat').should.be.equal(true);
    decoded.hasOwnProperty('exp').should.be.equal(true);
  });
});
