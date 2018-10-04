import {ApiOperationCallable, ApiOperationEvent} from '../../../src';
import {QueryInterface} from '@rxstack/query-filter';

export const modifyQuery = (query: QueryInterface): ApiOperationCallable => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.request.attributes.set('query', query);
  };
};