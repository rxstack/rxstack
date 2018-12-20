import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface RemoveOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  onPreRead?: ApiOperationCallback[];
  onPreRemove?: ApiOperationCallback[];
  onPostRemove?: ApiOperationCallback[];
}