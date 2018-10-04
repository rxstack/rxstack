import {ApiOperationCallable, ApiOperationEvent} from '../../../src';

export const setRequestParam = (key: string, value: any): ApiOperationCallable => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.request.params.set(key, value);
  };
};