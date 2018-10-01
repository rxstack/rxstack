import {Injectable, InjectionToken} from 'injection-js';
import {Constructable, ServiceInterface} from '../../src';
import {QueryInterface} from '@rxstack/query-filter';
import {plainToClass} from 'class-transformer';
import {TaskModel} from './task.model';

export const TASK_SERVICE_TOKEN = new InjectionToken<ServiceInterface<TaskModel>>('TASK_SERVICE_TOKEN');

@Injectable()
export class TaskService<T> implements ServiceInterface<T> {

  constructor(protected type: Constructable<T>) { }

  count(criteria?: Object): Promise<number> {
    return undefined;
  }

  async find(id: any, options?: any): Promise<any> {
    switch (id) {
      case 'not_found':
        return null;
      default:
        return this.plainToClass({ '_id': 1, 'name': 'my task', 'completed': true});
    }
  }

  async findMany(query?: QueryInterface, options?: any): Promise<any[]> {
    return undefined;
  }

  async findManyAndCount(query?: QueryInterface, options?: any): Promise<[any[], number]> {
    return undefined;
  }

  async findOne(criteria: Object, options?: any): Promise<any> {
    return undefined;
  }

  async insertMany(data: Object[], options?: any): Promise<any[]> {
    return undefined;
  }

  async insertOne(data: Object, options?: any): Promise<any> {
    return undefined;
  }

  async removeMany(criteria: Object, options?: any): Promise<number> {
    return undefined;
  }

  async removeOne(id: any, options?: any): Promise<void> {
    return undefined;
  }

  async updateMany(criteria: Object, data: Object, options?: any): Promise<number> {
    return undefined;
  }

  async updateOne(id: any, data: Object, options?: any): Promise<void> {
    return undefined;
  }

  protected plainToClass(data: Object): T {
    return plainToClass(this.type, data);
  }
}