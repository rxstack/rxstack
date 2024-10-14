import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Token} from '../src/models';
import {User} from '../src/models/user';
import {AuthenticationProviderManager} from '../src/authentication/authentication-provider-manager';
import {BadCredentialsException} from '../src/exceptions';
import {Application} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:TokenAuthenticationProvider', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should authenticate token', async () => {
    const token = new Token('generated-token');
    const provider = injector.get(AuthenticationProviderManager).get('token');
    const authToken = await provider.authenticate(token);
    expect(authToken.isAuthenticated()).toBeTruthy();
    expect(authToken.getUser()).toBeInstanceOf(User);
    expect(authToken.hasRole('ROLE_ADMIN')).toBeTruthy();
  });

  it('should throw an exception if user identity field is not found', async () => {
    const token = new Token('no-username');
    const provider = injector.get(AuthenticationProviderManager).get('token');
    let exception: BadCredentialsException;
    try {
      await provider.authenticate(token);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(BadCredentialsException);
  });

  it('should throw an exception if token is invalid', async () => {
    const token = new Token('invalid');
    const provider = injector.get(AuthenticationProviderManager).get('token');
    let exception: BadCredentialsException;
    try {
      await provider.authenticate(token);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(BadCredentialsException);
  });
});
