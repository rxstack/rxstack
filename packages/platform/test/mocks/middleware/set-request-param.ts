import {ApiOperationCallback, ApiOperationEvent} from '../../../src';

export const setRequestParam = (key: string, value: any): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.request.params.set(key, value);
  };
};