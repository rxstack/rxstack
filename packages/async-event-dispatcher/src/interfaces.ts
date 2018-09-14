import {GenericEvent} from './generic-event';

/**
 *  Function signature of an event listener
 */
export type EventCallable = (event: GenericEvent) => Promise<void>;

/**
 * Observer type contains event listener construction data
 */
export type Observer = {
  name: string;
  callable: EventCallable;
  priority?: number;
};
