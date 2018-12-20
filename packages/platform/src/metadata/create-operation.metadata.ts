import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface CreateOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  onPreCreate?: ApiOperationCallback[];
  onPostCreate?: ApiOperationCallback[];
}