import {describe, expect, it} from '@jest/globals';
import {GenericEvent} from '../src/generic-event';

describe('GenericEvent', () => {

  let genericEvent: GenericEvent;

  beforeEach(() => {
    genericEvent = new GenericEvent();
  });

  it('should not stop propagation', () => {
    expect(genericEvent.isPropagationStopped()).toBe(false);
  });

  it('should stop propagation', () => {
    genericEvent.stopPropagation();
    expect(genericEvent.isPropagationStopped()).toBe(true);
  });
});
