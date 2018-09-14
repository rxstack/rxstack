import {GenericEvent} from '../src/generic-event';
import { expect } from 'chai';

describe('GenericEvent', () => {

  let genericEvent: GenericEvent;

  beforeEach(() => {
    genericEvent = new GenericEvent();
  });

  it('should not stop propagation', () => {
    expect(genericEvent.isPropagationStopped()).be.false;
  });

  it('should stop propagation', () => {
    genericEvent.stopPropagation();
    expect(genericEvent.isPropagationStopped()).be.true;
  });
});