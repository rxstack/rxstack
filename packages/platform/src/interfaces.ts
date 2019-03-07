import {QueryInterface} from '@rxstack/query-filter';
import {OperationEvent} from './events/operation.event';

export const PLATFORM_OPERATION_KEY = 'PLATFORM_OPERATION_KEY';

export type OperationCallback = (event: OperationEvent) => Promise<void>;

export interface Pagination {
  count: number;
  limit: number;
  skip: number;
}

export interface ValidationError {
  path: string;
  value: any;
  message: string;
}

export interface ServiceOptions {
  idField: string;
  defaultLimit: number;
}

export interface ServiceInterface<T> {

  options: ServiceOptions;

  insertOne(data: Object, options?: any): Promise<T>;

  insertMany(data: Object[], options?: any): Promise<T[]>;

  updateOne(id: any, data: Object, options?: any): Promise<void>;

  updateMany(criteria: Object, data: Object, options?: any): Promise<number>;

  removeOne(id: any, options?: any): Promise<void>;

  removeMany(criteria: Object, options?: any): Promise<number>;

  count(criteria?: Object, options?: any): Promise<number>;

  find(id: any, options?: any): Promise<T>;

  findOne(criteria: Object, options?: any): Promise<T>;

  findMany(query?: QueryInterface, options?: any): Promise<T[]>;
}