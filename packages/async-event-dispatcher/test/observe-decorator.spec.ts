import 'reflect-metadata';
import {describe, expect, it} from '@jest/globals';
import {GenericEvent} from '../src/generic-event';
import {EVENT_LISTENER_KEY, Observe} from '../src/decorators';
import {EventListenerMetadata} from '../src/metadata';

export class ObserverClass {

  @Observe('pre.foo')
  async preFoo(event: GenericEvent): Promise<void> { }

  @Observe('pre.foo', 20)
  async preFoo2(event: GenericEvent): Promise<void> { }

  @Observe('post.foo')
  async postFoo(event: GenericEvent): Promise<void> { }
}

describe('@Observe decorator', function() {
  it('should add observers to metadata', function() {
    const metadata: EventListenerMetadata = Reflect.getMetadata(EVENT_LISTENER_KEY, ObserverClass);
    expect(metadata.target).toBe(ObserverClass);
    expect(metadata.observers.length).toBe(3);
  });
});
