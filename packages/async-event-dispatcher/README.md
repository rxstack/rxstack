# The AsyncEventDispatcher Component

> The AsyncEventDispatcher component provides tools that allow your application components to communicate with each other
  by dispatching events and listening to them.
  
## Installation

1. ` npm install @rxstack/async-event-dispatcher --save `

2. You need to install `reflect-metadata` shim:

    `npm install reflect-metadata --save`

    and import it somewhere in the global place of your app (for example in `app.ts`):

    `import "reflect-metadata";`

## Usage

* [Events](#events)
* [Naming Conventions](#naming-conventions)
* [Event Objects](#event-objects)
* [The Dispatcher](#the-dispatcher)
* [Connecting Listeners](#connecting-listeners)
* [Creating an Event Class](#creating-an-event-class)
* [Stopping Event Flow/Propagation](#stopping-event-flow/propagation)
* [Using decorators to register event listeners](#using-decorators)

### <a name="events"></a> Events
When an event is dispatched, it's identified by a unique name (e.g. `order.placed`), which any number of listeners 
might be listening to. An Event instance is also created and passed to all of the listeners. 
As you'll see later, the Event object itself often contains data about the event being dispatched.

### <a name="naming-conventions"></a> Naming Conventions
The unique event name can be any string, but optionally follows a few simple naming conventions:
- Use only lowercase letters, numbers, dots (`.`) and underscores (`_`);
- Prefix names with a namespace followed by a dot (e.g. `order.`, `user.*`);
- End names with a verb that indicates what action has been taken (e.g. `order.placed`).

### <a name="event-objects"></a> Event Objects
When the dispatcher notifies listeners, it passes an actual [GenericEvent](src/generic-event.ts) 
object (or one that extends it) to those listeners. 
The base Event class is very simple: it contains a method for stopping event propagation, but not much else.

### <a name="the-dispatcher"></a> The Dispatcher
The dispatcher is the central object of the event dispatcher system. In general, a single dispatcher is created, 
which maintains a registry of listeners. When an event is dispatched via the dispatcher, 
it notifies all listeners registered with that event:

```typescript
import { AsyncEventDispatcher } from '@rxstack/async-event-dispatcher'

const dispatcher = new AsyncEventDispatcher();
```

### <a name="connecting-listeners"></a> Connecting Listeners
To take advantage of an existing event, you need to connect a listener to the dispatcher so that it can be notified 
when the event is dispatched. A call to the dispatcher's addListener() 
method associates any valid callable to an event:

```typescript
// ...

dispatcher.addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
  // do something
}, 10);
```

The addListener() method takes up to three arguments:

1. The event name (string) that this listener wants to listen to;
2. A callable that will be executed when the specified event is dispatched;
3. An optional priority integer (higher equals more important and therefore that the listener will be triggered earlier) 
that determines when a listener is triggered versus other listeners (defaults to 0). 
If two listeners have the same priority, they are executed in the order that they were added to the dispatcher.

### <a name="creating-an-event-class"></a> Creating an Event Class
Suppose you want to create a new event - `order.placed` - that is dispatched each time a customer orders 
a product with your application. When dispatching this event, you'll pass a custom event instance that has access 
to the placed order. Start by creating this custom event class and documenting it:

```typescript
export class OrderEvent {
  static readonly eventName = 'order.placed'
  
  constructor(protected order: Order) { }
  
  getOrder(): Order {
    return this.order;
  }
}
```
Each listener now has access to the order via the getOrder() method.

### Dispatch the Event
The `dispatch()` method notifies all listeners of the given event. It takes two arguments: 
the name of the event to dispatch and the Event instance to pass to each listener of that event (optional):

```typescript
// the order is somehow created or retrieved
const order = new Order();

// creates the OrderEvent and dispatches it
const event = new OrderEvent(order);
await dispatcher.dispatch(OrderEvent.eventName, event);
```
Notice that the special `OrderEvent` object is created and passed to the dispatch() method 
and a promise is returned and needs to be resolved. 
Now, any listener to the `order.placed` event will receive the OrderEvent.

### <a name="stopping-event-flow/propagation"></a> Stopping Event Flow/Propagation
In some cases, it may make sense for a listener to prevent any other listeners from being called. 
In other words, the listener needs to be able to tell the dispatcher to stop all propagation of 
the event to future listeners (i.e. to not notify any more listeners). 
This can be accomplished from inside a listener via the `stopPropagation()` method:

```typescript
// ...

dispatcher.addListener('pre.foo', async (event: CustomEvent): Promise<void> => {
  // do something
  event.stopPropagation();
});
```

Now, any listeners to `pre.foo` that have not yet been called will not be called.

### <a name="using-decorators"></a> Using decorators to register event listeners
Sometimes you may want to use classes to register event listeners. 
In this case you can take advantage of `@Observe` decorator.

```typescript
// ...

export class Observer {
  @Observe('pre.foo', 10)
  async preFoo(event: GenericEvent): Promise<void> {
    // do something
  }
}
````
Now metadata from `@Observe` decorator will be added to 'reflect-metadata' storage.

Let's register the event listener:

```typescript
import {
  AsyncEventDispatcher, EVENT_LISTENER_KEY, EventListenerMetadata,
  ObserverMetadata
} from '@rxstack/async-event-dispatcher';

const observerInstance = new Observer();
const metadata: EventListenerMetadata = Reflect.getMetadata(EVENT_LISTENER_KEY, observerInstance.constructor);
metadata.observers.forEach((observer: ObserverMetadata) => {
    dispatcher.addListener(
      observer.eventName,
      observerInstance[observer.propertyKey].bind(observerInstance),
      observer.priority
    );
});
````
This approach is useful if your application is using a dependency injector.

## License

Licensed under the [MIT license](LICENSE).
