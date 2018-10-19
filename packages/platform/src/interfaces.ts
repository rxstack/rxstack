import {QueryInterface} from '@rxstack/query-filter';
import {ApiOperationEvent} from './events/api-operation.event';

export const API_OPERATION_KEY = 'API_OPERATION_KEY';

export type ApiOperationCallback = (event: ApiOperationEvent) => Promise<void>;

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

export interface ServiceInterface<T extends ResourceInterface> {
  createNew(): Promise<T>;

  save(resource: T): Promise<T>;

  remove(resource: T): Promise<void>;

  count(criteria?: Object): Promise<number>;

  find(id: any): Promise<T>;

  findOne(criteria: Object): Promise<T>;

  findMany(query?: QueryInterface): Promise<T[]>;
}