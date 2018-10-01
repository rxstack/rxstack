import {ApiOperationCallable, ApiOperationEvent} from '../../../src';

export const populateResult = (data: any): ApiOperationCallable => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.result = data;
  };
};