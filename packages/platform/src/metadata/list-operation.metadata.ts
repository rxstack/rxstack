import {QueryFilterSchema} from '@rxstack/query-filter';
import {ApiOperationCallback} from '../interfaces';
import {ServiceAwareOperationMetadata} from './service-aware-operation.metadata';

export interface ListOperationMetadata<T> extends ServiceAwareOperationMetadata<T> {
  queryFilterSchema?: QueryFilterSchema;
  paginated?: boolean;
  onPreCollectionRead?: ApiOperationCallback[];
  onQuery?: ApiOperationCallback[];
  onPostCollectionRead?: ApiOperationCallback[];
}