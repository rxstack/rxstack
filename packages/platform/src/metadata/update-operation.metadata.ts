import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface UpdateOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  onPreRead?: ApiOperationCallback[];
  onPreUpdate?: ApiOperationCallback[];
  onPostUpdate?: ApiOperationCallback[];
}