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

export interface ResourceInterface {
  id: any;
}

export interface Validation {
  model: Object;
  options: ValidationOptions;
}

export interface ServiceInterface<T extends ResourceInterface> {
  createNew(): Promise<T>;

  save(resource: T): Promise<T>;

  remove(resource: T): Promise<void>;

  count(criteria?: Object): Promise<number>;

  findMany(query?: QueryInterface, options?: any): Promise<T[]>;

  findOne(criteria: Object, options?: any): Promise<T>;

  find(id: any): Promise<T>;
}