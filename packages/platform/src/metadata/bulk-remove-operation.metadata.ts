import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface BulkRemoveOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  onPreBulkRemove?: ApiOperationCallback[];
  onPostBulkRemove?: ApiOperationCallback[];
}