import {QueryInterface, SortInterface} from '@rxstack/query-filter';
import {ApiOperationEvent} from './events/api-operation.event';

export const API_OPERATION_KEY = 'API_OPERATION_KEY';

export type ApiOperationCallback = (event: ApiOperationEvent) => Promise<void>;

export interface ServiceOptions {
  idField: string;
}

export interface DriverOptions { }

export interface ServiceInterface<T> {

  options: ServiceOptions;

  insertOne(data: Object, options?: DriverOptions): Promise<T>;

  insertMany(data: Object[], options?: DriverOptions): Promise<T[]>;

  updateOne(id: any, data: Object, options?: DriverOptions): Promise<T>;

  updateMany(criteria: Object, data: Object, options?: DriverOptions): Promise<number>;

  removeOne(id: any, options?: DriverOptions): Promise<void>;

  removeMany(criteria: Object, options?: DriverOptions): Promise<number>;

  count(criteria?: Object, options?: DriverOptions): Promise<number>;

  findOne(criteria: Object, sort?: SortInterface, options?: DriverOptions): Promise<T>;

  findMany(query: QueryInterface, options?: DriverOptions): Promise<T[]>;
}