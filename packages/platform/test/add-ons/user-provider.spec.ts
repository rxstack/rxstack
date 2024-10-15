import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {UserProvider} from '../../src/index';
import {User, UserNotFoundException} from '@rxstack/security';

describe('Platform:Add-Ons:UserProvider', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  it('should match provider name', async () => {
    expect(injector.get(UserProvider).getName()).toBe(UserProvider.PROVIDE_NAME);
  });

  it('should load user by username', async () => {
    const user = await injector.get(UserProvider).loadUserByUsername('admin');
    expect(user).toBeInstanceOf(User);
  });

  it('should throw an exception if user is not found', async () => {
    let exception: UserNotFoundException;
    try {
      await injector.get(UserProvider).loadUserByUsername('not_found');
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(UserNotFoundException);
  });
});
