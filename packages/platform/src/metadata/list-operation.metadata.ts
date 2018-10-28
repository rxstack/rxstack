import {QueryFilterSchema} from '@rxstack/query-filter';
import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallback, ServiceInterface} from '../interfaces';

export interface ListOperationMetadata<T> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  queryFilterSchema?: QueryFilterSchema;
  paginated?: boolean;
  onPreRead?: ApiOperationCallback[];
  onQuery?: ApiOperationCallback[];
  onPostRead?: ApiOperationCallback[];
}