import {describe, expect, it} from '@jest/globals';
import {AsyncEventDispatcher, asyncEventDispatcher} from '../src/async-event-dispatcher';
import {GenericEvent} from '../src/generic-event';

class CustomEvent extends GenericEvent {
  modified = 0;
}

describe('AsyncEventDispatcher', () => {

  beforeEach(() => {
    asyncEventDispatcher.reset();
  });

  it('initial state', () => {
    expect(asyncEventDispatcher.getListeners('pre.foo').length).toBe(0);
    expect(asyncEventDispatcher.hasListeners('pre.foo')).toBe(false);
  });

  it('should add listeners', () => {
    asyncEventDispatcher
      .addListener('pre.foo', async (event: GenericEvent): Promise<void> => { });

    asyncEventDispatcher
      .addListener('pre.foo', async (event: GenericEvent): Promise<void> => { });

    expect(asyncEventDispatcher.getListeners('pre.foo').length).toBe(2);
    expect(asyncEventDispatcher.hasListeners('pre.foo')).toBe(true);
  });

  it('should dispatch', async () => {
    const event = new CustomEvent();

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 1;
      }, 0);

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 2;
      }, -10);

    await asyncEventDispatcher.dispatch('pre.foo', event);
    expect(event.modified).toBe(2);
  });

  it('should dispatch without event', async () => {
    asyncEventDispatcher
      .addListener('pre.bar', async (event: GenericEvent): Promise<void> => {});

    const event = await asyncEventDispatcher.dispatch('pre.bar');
    expect(event).toBeInstanceOf(GenericEvent);
  });

  it('should remove listeners', async () => {
    asyncEventDispatcher
      .addListener('pre.foo', async (event: GenericEvent): Promise<void> => { });
    asyncEventDispatcher.removeListeners('pre.foo');
    expect(asyncEventDispatcher.getListeners('pre.foo').length).toBe(0);
    // should do nothing
    await asyncEventDispatcher.dispatch('pre.foo');
  });


  it('should stop event propagation', async () => {
    const event = new CustomEvent();

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 1;
        event.stopPropagation();
      }, 0);

    asyncEventDispatcher
      .addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
        event.modified = 2;
      }, -10);


    await asyncEventDispatcher.dispatch('pre.foo', event);
    expect(event.isPropagationStopped()).toBe(true);
    expect(event.modified).toBe(1);
  });

  it('should throw error', async () => {
    asyncEventDispatcher
      .addListener('pre.bar', async (event: GenericEvent): Promise<void> => {
        throw new Error('error');
      });

    await asyncEventDispatcher.dispatch('pre.bar').catch((err) => {
      expect(err.message).toBe('error');
    });
  });
});
