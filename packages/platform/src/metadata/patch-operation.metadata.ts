import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface PatchOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  onPrePatch?: ApiOperationCallback[];
  onPostPatch?: ApiOperationCallback[];
}