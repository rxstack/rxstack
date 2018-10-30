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

  create(data: Object, options?: DriverOptions): Promise<T>;

  replace(id: any, data: Object, options?: DriverOptions): Promise<T>;

  patch(id: any, data: Object, options?: DriverOptions): Promise<T>;

  remove(id: any, options?: DriverOptions): Promise<void>;

  count(criteria?: Object, options?: DriverOptions): Promise<number>;

  findOneById(id: any, options?: DriverOptions): Promise<T>;

  findOne(criteria: Object, sort?: SortInterface, options?: DriverOptions): Promise<T>;

  findMany(query: QueryInterface, options?: DriverOptions): Promise<T[]>;
}