import 'reflect-metadata';
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

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    injector.get(UserProviderManager).reset();
    await app.stop();
  });

  it('should get provider by name', async () => {
    const provider = injector.get(UserProviderManager).get('in-memory');
    provider.getName().should.be.equal('in-memory');
  });

  it('should load the admin', async () => {
    const user = await injector.get(UserProviderManager).loadUserByUsername('admin');
    user.username.should.be.equal('admin');
  });

  it('should not load the admin', async () => {
    try {
      await injector.get(UserProviderManager).loadUserByUsername('none');
    } catch (e) {
      e.should.be.instanceOf(UserNotFoundException);
    }
  });

  it('should load user from payload', async () => {
    const provider = new PayloadUserProvider(
      (data: UserInterface) => new User(data.username, null, data.roles)
    );
    provider.getName().should.be.equal('payload');
    const user = await provider.loadUserByUsername('joe', {
      'username': 'joe',
      'roles': ['USER']
    });
    user.should.be.instanceOf(User);
  });


  it('should not load payload user', async () => {
    const provider = new PayloadUserProvider(
      (data: UserInterface) => null
    );
    try {
      await provider.loadUserByUsername('joe', {
        'username': 'joe',
        'roles': ['USER']
      });
    } catch (e) {
      e.should.be.instanceOf(UserNotFoundException);
    }
  });

});
