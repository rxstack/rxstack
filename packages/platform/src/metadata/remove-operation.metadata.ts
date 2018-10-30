import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface RemoveOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  onPreRemove?: ApiOperationCallback[];
  onPostRemove?: ApiOperationCallback[];
}