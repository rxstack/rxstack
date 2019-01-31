import {Injectable} from 'injection-js';
import {ServiceInterface, ServiceOptions} from '../../src';
import {QueryInterface} from '@rxstack/query-filter';
import {TaskModel} from './task.model';

@Injectable()
export class TaskService implements ServiceInterface<TaskModel> {

  static data: TaskModel[] = [
    { 'id': 'task-1', 'name': 'my task', 'completed': true}
  ];

  options: ServiceOptions = { idField: 'id', defaultLimit: 25 };

  async insertOne(data: Object): Promise<TaskModel> {
    return data as TaskModel;
  }

  async insertMany(data: Object[]): Promise<TaskModel[]> {
    return data as TaskModel[];
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

  async find(id: any): Promise<TaskModel> {
    switch (id) {
      case 'not_found':
        return null;
      default:
        return TaskService.data[0];
    }
  }
  async findOne(criteria: Object): Promise<TaskModel> {
    const id = criteria['id']['$eq'];
    switch (id) {
      case 'not_found':
        return null;
      default:
        return TaskService.data[0];
    }
  }

  async findMany(query?: QueryInterface): Promise<TaskModel[]> {
    return TaskService.data;
  }
}