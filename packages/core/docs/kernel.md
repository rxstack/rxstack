# The Kernel

> The Kernel provides a structured process for converting a Request into a Response by making use of 
the [AsyncEventDispatcher](../../async-event-dispatcher/README.md).

## Documentation

* [Decorators](#decorators)
* [Metadata storage](#metadata-storage)
* [Request object](#request-object)
* [Response object](#response-object)
* [Events](#events)
* [Request Event](#kernel-request)
* [Response Event](#kernel-response)
* [Exception Event](#kernel-exception)
* [Http/Websocket definitions](#definitions)

### <a name="decorators"></a>  Decorators
There are two decorators `@Http` and `@Websocket` which helps you to register controller methods into the `kernel`.

```typescript
import {Request, Response, Http, WebSocket} from '@rxstack/core';

export class IndexController {
  @Http('GET', '/index', 'index')
  @WebSocket('index')
  async indexAction(request: Request): Promise<Response> {
    return new Response('Hello world');
  }
}
```

`@Http` decorator takes up to three arguments:
1. Http method: `'HEAD' | 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'`
2. Http path:  used by underlying framework to match the route.
3. Route name: unique identifier


`@Websocket` decorator takes only one argument:
1. Route name: unique identifier used by socket framework as an event name

The controller method itself accepts one argument `Request` and must return a promise of `Response` object.

 ### <a name="metadata-storage"></a>  Metadata storage
Once decorators are defined in the controller then metadata is extracted from the methods and added to the metadata storage.
You can register methods without using decorators:

```typescript
import {httpMetadataStorage, webSocketMetadataStorage} from '@rxstack/core';

httpMetadataStorage.add({
  'target': IndexController,
  'name': 'index',
  'path': '/index',
  'httpMethod': 'GET',
  'propertyKey': 'indexAction',
  'transport': 'HTTP'
});

webSocketMetadataStorage.add({
  'target': IndexController,
  'name': 'index',
  'propertyKey': 'indexAction',
  'transport': 'SOCKET'
});
```
 ### <a name="request-object"></a>  Request object
A Request object holds information about the client request. This information can be accessed via several public properties:

- `headers`: server request headers
- `params`: merged query string and post parameters
- `body`: raw request body
- `attributes`: extra data
- `path`: http path (available only in http servers)
- `method` http method (available only in http servers)
- `controller`: Instance of the controller object
- `routeName`: name of the route
- `token`: security token (optional)
- `connection`: socket connection (available only in socket servers)

 ### <a name="response-object"></a>  Response object
 A Response object holds all the information that needs to be sent back to the client from a given request. 
 The constructor takes up to two arguments: the response content and the status code.
 Additionally response headers could be set via `Response.headers`.
 
 - `content`: any type of data, defaults to `null`
 - `statusCode`: number, defaults to `200`
 
Simple response:
 ```typescript
   @Http('GET', '/get-something', 'app_get_something')
   async getAction(request: Request): Promise<Response> {
     return new Response('something', 200);
   }
```

Streaming file:
 
```typescript
  @Http('GET', '/download', 'app_download')
  async downloadAction(request: Request): Promise<Response> {
    const path =  'path_to_file';
    const st = fs.createReadStream(path);
    const response = new Response(st);
    response.headers.set('Content-Disposition', `attachment; filename="my_file.txt"`);
    response.headers.set('Content-Type', 'text/plain');
    return response;
  }
```

> Currently streaming is not supported by websockets!
 
### <a name="events"></a>  Events
The `kernel` works internally by dispatching events. 
There are three types of events:

##### <a name="kernel-request"></a> The `kernel.request` event: 
The event is used to initialize parts of the system, 
or return a Response if possible (e.g. a security layer that denies access).
If a Response is returned at this stage, the process skips directly to the `kernel.response` event.

> When setting a response for the `kernel.request` event, the propagation is stopped. 
This means listeners with lower priority won't be executed.

Example:

```typescript
export class MyListener {
  @Observe(KernelEvents.KERNEL_REQUEST)
  async onRequest(event: RequestEvent): Promise<void> {
    // hit cache
    const response = new Response('cached response');
    event.setResponse(response);
  }
}
```

##### <a name="kernel-response"></a> The `kernel.response` event: 
The event is used to modify the `Response` object just before it is sent. The end goal of the kernel is to transform
 a `Request` into a `Response`.
The `Response` might be created during the `kernel.request` event, returned from the controller, or returned by one of the listeners.

Example:

```typescript
export class MyListener {
  @Observe(KernelEvents.KERNEL_RESPONSE)
  async onResponse(event: ResponseEvent): Promise<void> {
    const response = event.getResponse();
    
    // ... modify the response object
  }
}
```

##### <a name="kernel-exception"></a> The `kernel.exception` event: 
The event is used to handle exceptions and create an appropriate Response to return for the exception.

If an exception is thrown at any point inside the `Kernel`, another event - `kernel.exception` is dispatched. 
the `kernel.exception` event is dispatched so that your system can somehow respond to the exception.
Each listener to this event is passed an `ExceptionEvent` object, which you can use to access the original exception via 
the getException() method. A typical listener on this event will check for a certain type of exception 
and create an appropriate error Response.

> When setting a response for the `kernel.exception` event, the propagation is stopped. 
This means listeners with lower priority won't be executed.

Example:

```typescript
export class MyListener {
  @Observe(KernelEvents.KERNEL_EXCEPTION)
  async onException(event: ExceptionEvent): Promise<void> {
     const exception = event.getException();
     const response = new Response();
     // setup the Response object based on the caught exception
     event.setResponse(response);
 
     // you can alternatively set a new Exception
     // const exception = new Exception('Some special exception');
     // event.setException(exception);
  }
}
```

### <a name="definitions"></a> Http/Websocket definitions
Internally `Kernel` converts controller method and all listeners into an `http` or `websocket` definition.
It might be useful to write functional tests.

Http definition:

- name: route name
- handler: function which accepts `request` and returns `response`
- path: http path
- method: http method

```typescript
const def = kernel.httpDefinitions.find((item) => item.name === 'my_route_name');
const request = new Request('HTTP');
const response: Response = await def.handler(request);
```

Websocket definition:

- name: socket event name
- handler: function which accepts `request` and returns `response`

```typescript
const def = kernel.webSocketDefinitions.find((item) => item.name === 'my_event');
const request = new Request('SOCKET');
const response: Response = await def.handler(request);
```






