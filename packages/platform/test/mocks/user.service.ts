import {Injectable} from 'injection-js';
import {ServiceInterface, ServiceOptions} from '../../src';
import {QueryInterface} from '@rxstack/query-filter';
import {TaskModel} from './task.model';
import {User} from '@rxstack/security';

@Injectable()
export class UserService implements ServiceInterface<User> {

  static data: TaskModel[] = [
    { 'id': 'task-1', 'name': 'my task', 'completed': true}
  ];

  options: ServiceOptions = { idField: 'id', defaultLimit: 25 };

  async insertOne(data: Object): Promise<User> {
    return data as User;
  }

  async insertMany(data: Object[]): Promise<User[]> {
    return data as User[];
  }

  async updateOne(id: any, data: Object): Promise<void> { }

  async updateMany(criteria: Object, data: Object): Promise<number> {
    return 1;
  }

  async removeOne(id: any): Promise<void> { }

  async removeMany(criteria: Object): Promise<number> {
    return 1;
  }

  async count(criteria?: Object): Promise<number> {
    return 1;
  }

  async find(id: any): Promise<User> {
    return null;
  }

  async findOne(criteria: Object): Promise<User> {
    const id = criteria['username']['$eq'];
    switch (id) {
      case 'not_found':
        return null;
      default:
        return new User('admin');
    }
  }

  async findMany(query?: QueryInterface): Promise<User[]> {
    return [];
  }
}