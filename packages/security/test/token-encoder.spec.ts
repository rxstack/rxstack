import 'reflect-metadata';
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

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should encode and decode', async () => {
    const encoder = injector.get(TOKEN_ENCODER);
    const encoded = await encoder.encode({'key': 'value'});
    const decoded = await encoder.decode(encoded);
    decoded.hasOwnProperty('key').should.be.equal(true);
    decoded.hasOwnProperty('iss').should.be.equal(true);
    decoded.hasOwnProperty('iat').should.be.equal(true);
    decoded.hasOwnProperty('exp').should.be.equal(true);
    console.log(decoded);
  });

  it('should throw an exception if token is invalid', async () => {
    const encoder = injector.get(TOKEN_ENCODER);
    let exception: JWTDecodeFailureException;
    try {
      await encoder.decode('invalid');
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(JWTDecodeFailureException);
  });
});
