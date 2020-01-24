import {UserNotFoundException, UserProviderInterface} from '@rxstack/security';
import {UserInterface} from '@rxstack/core';
import {Injectable} from 'injection-js';
import {ServiceInterface} from '../interfaces';

@Injectable()
export class UserProvider<T extends UserInterface> implements UserProviderInterface {

  static readonly PROVIDE_NAME = 'platform-service';

  constructor(private service: ServiceInterface<T>, private userIdentityField: string) { }

  async loadUserByUsername(username: string): Promise<T> {
    const user = await this.service.findOne({[this.userIdentityField]: {'$eq': username}});
    if (user) return user; else throw new UserNotFoundException(username);
  }

  getName(): string {
    return UserProvider.PROVIDE_NAME;
  }
}