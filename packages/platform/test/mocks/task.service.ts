import {Injectable} from 'injection-js';
import {Constructable, ResourceInterface, ServiceInterface} from '../../src';
import {QueryInterface} from '@rxstack/query-filter';
import {plainToClass} from 'class-transformer';

@Injectable()
export class TaskService<T extends ResourceInterface> implements ServiceInterface<T> {

  constructor(protected type: Constructable<T>) { }

  async createNew(): Promise<T> {
    return new this.type();
  }

  async save(resource: T): Promise<T> {
    return resource;
  }

  async remove(resource: T): Promise<void> {
    // do remove
  }

  async count(criteria?: Object): Promise<number> {
    return 1;
  }

  async find(id: any): Promise<T> {
    switch (id) {
      case 'not_found':
        return null;
      default:
        return this.plainToClass({ '_id': 1, 'name': 'my task', 'completed': true});
    }
  }

  async findOne(criteria: Object): Promise<T> {
    return null;
  }

  async findMany(query?: QueryInterface, options?: any): Promise<T[]> {
    return plainToClass(this.type, [
      { '_id': 1, 'name': 'my task', 'completed': true}
    ]);
  }

  protected plainToClass(data: Object): T {
    return plainToClass(this.type, data);
  }
}