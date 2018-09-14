import 'reflect-metadata';
import {EventListenerMetadata, ObserverMetadata} from './metadata';
export const EVENT_LISTENER_KEY = '__RXSTACK_EVENT_LISTENER__';

/**
 * Decorator is used to mark a method as an event listener
 *
 * @param {string} eventName
 * @param {number} priority
 * @returns {MethodDecorator}
 * @constructor
 */
export function Observe<T>(eventName: string, priority = 0): MethodDecorator {
  return function (target: Object, propertyKey: string): void {

    if (!Reflect.hasMetadata(EVENT_LISTENER_KEY, target.constructor)) {
      Reflect.defineMetadata(EVENT_LISTENER_KEY, {
        target: target.constructor,
        observers: []
      }, target.constructor);
    }

    const metadata: EventListenerMetadata = Reflect.getMetadata(EVENT_LISTENER_KEY, target.constructor);
    const observerMetadata: ObserverMetadata = {
      eventName: eventName,
      propertyKey: propertyKey,
      priority: priority
    };

    metadata.observers.push(observerMetadata);
  };
}
