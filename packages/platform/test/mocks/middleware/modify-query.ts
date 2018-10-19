import {ApiOperationCallback, ApiOperationEvent} from '../../../src';
import {QueryInterface} from '@rxstack/query-filter';

export const modifyQuery = (query: QueryInterface): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.request.attributes.set('query', query);
  };
};