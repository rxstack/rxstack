import {ApiOperationCallback, ApiOperationEvent} from '../../../src';
import {Response} from '@rxstack/core';

export const setResponse = (name: string): ApiOperationCallback => {
  return async (event: ApiOperationEvent): Promise<void> => {
    if (event.request.params.get('with_response') === name) {
      event.response = new Response(event.request.params.get('with_response'));
    }
  };
};