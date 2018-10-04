import {QueryFilterSchema} from '@rxstack/query-filter';
import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallable, ServiceInterface} from '../interfaces';
import {ClassTransformOptions} from 'class-transformer';

export interface ListOperationMetadata<T> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  paginated?: boolean;
  classTransformerOptions?: ClassTransformOptions;
  queryFilterSchema?: QueryFilterSchema;
  onPreRead?: ApiOperationCallable[];
  onQuery?: ApiOperationCallable[];
  onPostRead?: ApiOperationCallable[];
}