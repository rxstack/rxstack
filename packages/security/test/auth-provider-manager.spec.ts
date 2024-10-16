import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {AuthenticationProviderManager} from '../src/authentication/authentication-provider-manager';
import {UsernameAndPasswordToken} from '../src/models/username-and-password.token';
import {User} from '../src/models/user';
import {BadCredentialsException, ProviderNotFoundException} from '../src/exceptions/index';
import {TestToken} from './mocks/test-token';
import {TestSupportedToken} from './mocks/test-supported-token';
import {TestAuthenticationProviderException} from './mocks/test.authentication-provider';
import {AuthListener} from './mocks/auth.listener';
import {Application} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';
import {Exception} from '@rxstack/exceptions';

describe('Security:AuthenticationProviderManager', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should get provider by name', async () => {
    const provider = injector.get(AuthenticationProviderManager).get('user-password');
    expect(provider.getName()).toBe('user-password');
  });

  it('should authenticate token', async () => {
    const token = new UsernameAndPasswordToken('admin', 'admin');
    const manager = injector.get(AuthenticationProviderManager);
    const authToken = await manager.authenticate(token);
    expect(authToken.isAuthenticated()).toBeTruthy();
    expect(authToken.getUser()).toBeInstanceOf(User);
    expect(authToken.hasRole('ROLE_ADMIN')).toBeTruthy();
    expect(injector.get(AuthListener).successCalled).toBeTruthy();
  });

  it('should throw an exception if user password is invalid', async () => {
    const token = new UsernameAndPasswordToken('admin', 'invalid');
    const manager = injector.get(AuthenticationProviderManager);
    let exception;
    try {
      await manager.authenticate(token);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(BadCredentialsException);
    expect(injector.get(AuthListener).failureCalled).toBeTruthy();
  });

  it('should throw an exception if provider is not found', async () => {
    const token = new TestToken('test');
    const manager = injector.get(AuthenticationProviderManager);
    let exception: ProviderNotFoundException;
    try {
      await manager.authenticate(token);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(ProviderNotFoundException);
  });

  it('should throw an exception if provider exception is not caught', async () => {
    const token = new TestSupportedToken();
    const manager = injector.get(AuthenticationProviderManager);
    let exception: Exception;
    try {
      await manager.authenticate(token);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(TestAuthenticationProviderException);
  });
});
