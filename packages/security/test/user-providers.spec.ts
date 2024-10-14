import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {UserProviderManager} from '../src/user-providers/user-provider-manager';
import {UserNotFoundException} from '../src/exceptions/index';
import {User} from '../src/models';
import {PayloadUserProvider} from '../src/user-providers/payload-user-provider';
import {Application, UserInterface} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:UserProvider', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector = null;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  afterAll(async() =>  {
    injector.get(UserProviderManager).reset();
  });

  it('should get provider by name', async () => {
    const provider = injector.get(UserProviderManager).get('in-memory');
    expect(provider.getName()).toBe(('in-memory'));
  });

  it('should load the admin', async () => {
    const user = await injector.get(UserProviderManager).loadUserByUsername('admin');
    expect(user.username).toBe('admin');
  });

  it('should not load the admin', async () => {
    let exception: UserNotFoundException;
    try {
      await injector.get(UserProviderManager).loadUserByUsername('none');
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(UserNotFoundException);
  });

  it('should load user from payload', async () => {
    const provider = new PayloadUserProvider(
      (data: UserInterface) => new User(data.username, null, data.roles)
    );
    expect(provider.getName()).toBe('payload');
    const user = await provider.loadUserByUsername('joe', {
      'username': 'joe',
      'roles': ['USER']
    });
    expect(user).toBeInstanceOf(User);
  });


  it('should not load payload user', async () => {
    const provider = new PayloadUserProvider(
      (data: UserInterface) => null
    );
    let exception: UserNotFoundException;
    try {
      await provider.loadUserByUsername('joe', {
        'username': 'joe',
        'roles': ['USER']
      });
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(UserNotFoundException);
  });

});
