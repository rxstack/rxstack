import {QueryInterface} from '@rxstack/query-filter';
import {ApiOperationEvent} from './events/api-operation.event';
import {ValidationOptions} from 'class-validator';

export const API_OPERATION_KEY = 'API_OPERATION_KEY';

export type ApiOperationCallable = (event: ApiOperationEvent) => Promise<void>;

export interface Pagination<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

export interface Constructable<T> {
  new(): T;
}

export interface Validation {
  model: Object;
  options: ValidationOptions;
}

export interface ServiceInterface<T> {
  count(criteria?: Object): Promise<number>;
  findMany(query?: QueryInterface, options?: any): Promise<T[]>;
  findManyAndCount(query?: QueryInterface, options?: any): Promise<[T[], number]>;
  findOne(criteria: Object, options?: any): Promise<T>;
  find(id: any, options?: any): Promise<T>;
  insertOne(data: Object, options?: any): Promise<T>;
  insertMany(data: Object[], options?: any): Promise<T[]>;
  updateOne(id: any, data: Object, options?: any): Promise<void>;
  updateMany(criteria: Object, data: Object, options?: any): Promise<number>;
  removeOne(id: any, options?: any): Promise<void>;
  removeMany(criteria: Object, options?: any): Promise<number>;
}