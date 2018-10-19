import {ApiOperationCallback, ApiOperationEvent} from '../../../src';

export const populateResult = (data: any): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    event.setData(data);
  };
};