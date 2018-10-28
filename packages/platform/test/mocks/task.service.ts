import {Injectable} from 'injection-js';
import {ServiceInterface, ServiceOptions} from '../../src';
import {QueryInterface, SortInterface} from '@rxstack/query-filter';
import {TaskModel} from './task.model';

@Injectable()
export class TaskService implements ServiceInterface<TaskModel> {

  static data: TaskModel[] = [
    { 'id': 'task-1', 'name': 'my task', 'completed': true}
  ];

  options: ServiceOptions = { idField: 'id' };

  async create(data: Object): Promise<TaskModel> {
    return data as TaskModel;
  }

  async replace(id: any, data: Object): Promise<TaskModel> {
    return data as TaskModel;
  }

  async patch(id: any, data: Object): Promise<TaskModel> {
    return data as TaskModel;
  }

  async remove(id: any): Promise<void> { }

  async count(criteria?: Object): Promise<number> {
    return 1;
  }

  async findOneById(id: any): Promise<TaskModel> {
    switch (id) {
      case 'not_found':
        return null;
      default:
        return TaskService.data[0];
    }
  }

  async findOne(criteria: Object, sort?: SortInterface): Promise<TaskModel> {
    return TaskService.data[0];
  }

  async findMany(query: QueryInterface): Promise<TaskModel[]> {
    return TaskService.data;
  }
}