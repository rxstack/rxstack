import {OperationCallback, OperationEvent} from '../../../src';
import {Response} from '@rxstack/core';

export const setResponse = (name: string): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => {
    if (event.request.params.get('with_response') === name) {
      event.response = new Response(event.request.params.get('with_response'));
    }
  };
};