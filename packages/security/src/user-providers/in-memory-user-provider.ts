import * as _ from 'lodash';
import {Injectable} from 'injection-js';
import {UserFactoryFunc, UserProviderInterface} from '../interfaces';
import {UserNotFoundException} from '../exceptions/index';
import {UserInterface} from '@rxstack/core';

@Injectable()
export class InMemoryUserProvider<T extends UserInterface> implements UserProviderInterface {

  static readonly PROVIDER_NAME = 'in-memory';

  private users: T[] = [];

  constructor(data: T[],  factory: UserFactoryFunc<T>) {
    data.forEach((item) => this.users.push(factory(item)));
  }

  async loadUserByUsername(username: string): Promise<UserInterface> {
    const user = _.find<UserInterface>(this.users, {'username': username});
    if (!user) {
      throw new UserNotFoundException(username);
    }
    return user;
  }

  getName(): string {
    return InMemoryUserProvider.PROVIDER_NAME;
  }
}
