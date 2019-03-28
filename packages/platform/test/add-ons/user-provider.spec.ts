import 'reflect-metadata';
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

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  after(async() =>  {
    await app.stop();
  });

  it('should match provider name', async () => {
    injector.get(UserProvider).getName().should.be.equal(UserProvider.PROVIDE_NAME);
  });

  it('should load user by username', async () => {
    const user = await injector.get(UserProvider).loadUserByUsername('admin');
    user.should.be.instanceOf(User);
  });

  it('should throw an exception if user is not found', async () => {
    let exception: UserNotFoundException;
    try {
      await injector.get(UserProvider).loadUserByUsername('not_found');
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UserNotFoundException);
  });
});
