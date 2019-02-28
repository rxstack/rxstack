import {QueryInterface} from '@rxstack/query-filter';
import {OperationEvent} from './events/operation.event';

export const PLATFORM_OPERATION_KEY = 'PLATFORM_OPERATION_KEY';

export type OperationCallback = (event: OperationEvent) => Promise<void>;

export interface Pagination {
  count: number;
  limit: number;
  skip: number;
}

export interface ServiceOptions {
  idField: string;
  defaultLimit: number;
}

export interface ServiceInterface<T> {

  options: ServiceOptions;

  insertOne(data: Object): Promise<T>;

  insertMany(data: Object[]): Promise<T[]>;

  updateOne(id: any, data: Object): Promise<void>;

  updateMany(criteria: Object, data: Object): Promise<number>;

  removeOne(id: any): Promise<void>;

  removeMany(criteria: Object): Promise<number>;

  count(criteria?: Object): Promise<number>;

  find(id: any): Promise<T>;

  findOne(criteria: Object): Promise<T>;

  findMany(query?: QueryInterface): Promise<T[]>;
}