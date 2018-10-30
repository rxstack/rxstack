import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface WriteOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  type: 'POST' | 'PUT' | 'PATCH';
  onPreWrite?: ApiOperationCallback[];
  onPostWrite?: ApiOperationCallback[];
}