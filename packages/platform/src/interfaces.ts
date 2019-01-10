import {QueryInterface, SortInterface} from '@rxstack/query-filter';
import {OperationEvent} from './events/operation.event';

export const PLATFORM_OPERATION_KEY = 'PLATFORM_OPERATION_KEY';

export type OperationCallback = (event: OperationEvent) => Promise<void>;

export interface ServiceOptions {
  idField: string;
  supportDotNotation?: boolean;
}

export interface Options { }

export interface ServiceInterface<T> {

  options: ServiceOptions;

  insertOne(data: Object, options?: Options): Promise<T>;

  insertMany(data: Object[], options?: Options): Promise<T[]>;

  updateOne(id: any, data: Object, options?: Options): Promise<T>;

  updateMany(criteria: Object, data: Object, options?: Options): Promise<number>;

  removeOne(id: any, options?: Options): Promise<void>;

  removeMany(criteria: Object, options?: Options): Promise<number>;

  count(criteria?: Object, options?: Options): Promise<number>;

  findOne(criteria: Object, sort?: SortInterface, options?: Options): Promise<T>;

  findMany(query: QueryInterface, options?: Options): Promise<T[]>;
}