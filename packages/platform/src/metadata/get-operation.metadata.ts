import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface GetOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  onPreRead?: ApiOperationCallback[];
  onPostRead?: ApiOperationCallback[];
}