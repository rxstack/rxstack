import {ApiOperationCallable, ApiOperationEvent} from '../../../src';

export const setBody = (data: Object): ApiOperationCallable => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.request.body = data;
  };
};