import {Injectable} from 'injection-js';
import {UserFactoryFunc, UserProviderInterface} from '../interfaces';
import {UserNotFoundException} from '../exceptions/index';
import {UserInterface} from '@rxstack/core';

@Injectable()
export class PayloadUserProvider<T extends UserInterface> implements UserProviderInterface {

  static readonly PROVIDER_NAME = 'payload';

  constructor(private factory: UserFactoryFunc<T>) { }

  async loadUserByUsername(username: string, payload?: any): Promise<UserInterface> {
    const user = this.factory(payload);
    if (!user) {
      throw new UserNotFoundException(username);
    }
    return user;
  }

  getName(): string {
    return PayloadUserProvider.PROVIDER_NAME;
  }
}
