import {ApiOperationCallback, ApiOperationEvent} from '../../../src';

export const setBody = (data: Object): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.request.body = data;
  };
};