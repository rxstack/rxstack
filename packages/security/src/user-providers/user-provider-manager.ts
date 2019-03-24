import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {UserInterface} from '@rxstack/core';
import {UserNotFoundException} from '../exceptions/index';
import {ServiceRegistry} from '@rxstack/service-registry';

@Injectable()
export class UserProviderManager extends ServiceRegistry<UserProviderInterface> {

  async loadUserByUsername(username: string, payload?: any): Promise<UserInterface> {
    const user = await this.findUser(username, payload);
    if (!user) throw new UserNotFoundException(username);
    return user;
  }

  private async findUser(username: string, payload?: Object): Promise<UserInterface> {
    for (let i = 0; i < this.all().length; i++) {
      const provider = this.all()[i];
      try {
        return await provider.loadUserByUsername(username, payload);
      } catch (e) { }
    }
  }
}