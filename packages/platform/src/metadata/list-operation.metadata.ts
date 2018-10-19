import {QueryFilterSchema} from '@rxstack/query-filter';
import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallback, ResourceInterface, ServiceInterface} from '../interfaces';
import {ClassTransformOptions} from 'class-transformer';

export interface ListOperationMetadata<T extends ResourceInterface> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  paginated?: boolean;
  classTransformerOptions?: ClassTransformOptions;
  queryFilterSchema?: QueryFilterSchema;
  onPreRead?: ApiOperationCallback[];
  onQuery?: ApiOperationCallback[];
  onPostRead?: ApiOperationCallback[];
}