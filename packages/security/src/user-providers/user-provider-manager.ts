import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {UserInterface} from '@rxstack/core';
import {UserNotFoundException} from '../exceptions/index';
import {ServiceRegistry} from '@rxstack/service-registry';

@Injectable()
export class UserProviderManager extends ServiceRegistry<UserProviderInterface> {

  async loadUserByUsername(username: string, payload?: any): Promise<UserInterface> {
    const user = await this.findUser(username, payload);
    if (!user) {
      throw new UserNotFoundException(username);
    } else {
      return user;
    }
  }

  private async findUser(username: string, payload?: Object): Promise<UserInterface> {
    return this.all().reduce(
      async (current: Promise<UserInterface>, provider): Promise<UserInterface> => {
        const user = await current;
        if (user) {
          return user;
        }
        try {
          return await provider.loadUserByUsername(username, payload);
        } catch (e) {
          return null;
        }
    }, Promise.resolve(null));
  }
}