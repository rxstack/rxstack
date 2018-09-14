import {GenericEvent} from './generic-event';
import {EventCallable, Observer} from './interfaces';

/**
 * The AsyncEventDispatcher
 */
export class AsyncEventDispatcher {

  /**
   * Holds all events and its listeners
   *
   * @type {Map<any, any>}
   */
  private stack: Map<string, Observer[]> = new Map();

  /**
   * Adds an event listener that listens on the specified events.
   *
   * @param {string} eventName
   * @param {EventCallable} callable
   * @param {number} priority
   */
  addListener(eventName: string, callable: EventCallable, priority = 0): void {
    this.getNamedStack(eventName).push({name: eventName, callable: callable, priority: priority});
  }

  /**
   * Gets the listeners of a specific event sorted by descending priority.
   *
   * @param {string} eventName
   * @returns {EventCallable[]}
   */
  getListeners(eventName: string): EventCallable[] {
    const listeners = this.getNamedStack(eventName);
    return listeners
      .sort((a: Observer , b: Observer) => b.priority - a.priority)
      .map((item: Observer) => item.callable)
    ;
  }

  /**
   * Checks whether an event has any registered listeners.
   *
   * @param {string} eventName
   * @returns {boolean}
   */
  hasListeners(eventName: string): boolean {
    return this.getListeners(eventName).length > 0;
  }

  /**
   *  Removes event listeners from the specified event.
   *
   * @param {string} eventName
   */
  removeListeners(eventName: string): void {
    this.stack.delete(eventName);
  }

  /**
   * Removes all event listeners
   */
  reset(): void {
    this.stack.clear();
  }

  /**
   * Dispatches an event to all registered listeners.
   *
   * @param {string} eventName
   * @param {GenericEvent} event
   * @returns {Promise<GenericEvent>}
   */
  async dispatch(eventName: string, event?: GenericEvent): Promise<GenericEvent> {
    if (!event)
      event = new GenericEvent();
    const listeners = this.getListeners(eventName);
    if (listeners.length > 0)
      await this.doDispatch(listeners, event);

    return event;
  }

  /**
   * Gets a stack of a particular event
   *
   * @param {string} name
   * @returns {Observer[]}
   */
  private getNamedStack(name: string): Observer[] {
    if (!this.stack.has(name)) {
      this.stack.set(name, []);
    }
    return this.stack.get(name);
  }

  /**
   * Triggers the listeners of an event.
   *
   * @param {EventCallable[]} listeners
   * @param {GenericEvent} event
   * @returns {Promise<GenericEvent>}
   */
  private async doDispatch(listeners: EventCallable[], event: GenericEvent): Promise<GenericEvent> {
    return listeners.reduce((currrent: Promise<GenericEvent>, next: EventCallable): Promise<GenericEvent> => {
      return currrent.then(async (): Promise<GenericEvent> => {
        if (event.isPropagationStopped()) {
          return event;
        }
        return next.call(this, event);
      });

    }, Promise.resolve(event));
  }
}

/**
 * Exports single instance of AsyncEventDispatcher
 *
 * @type {AsyncEventDispatcher}
 */
export const asyncEventDispatcher = new AsyncEventDispatcher();