# RxStack SocketioServer Module

> The SocketioServer module integrates [`socketio`](https://socket.io/) in rxstack framework.

## Installation

```
npm install @rxstack/socketio-server --save

// peerDependencies
npm install @rxstack/async-event-dispatcher@^0.2 @rxstack/core@^0.2 @rxstack/exceptions@^0.2
```

## Documentation

* [Setup](#setup)
* [Module options](#module-options)
* [Server Events](#server-events)
* [Socketio middleware](#socketio-middleware)

### <a name="setup"></a>  Setup
`SocketioServer` module needs to be registered in the `application`. Let's create the application:

```typescript
import {Application, ApplicationOptions} from '@rxstack/core';
import {SocketioModule} from '@rxstack/socketio-server';

export const SOCKETIO_APP_OPTIONS: ApplicationOptions = {
  imports: [
    SocketioModule.configure({
      'host': 'localhost', 
      'port': 4000,
      'maxListeners': 64
    })
  ],
  servers: ['socketio'], //enables the server
  providers: [
    // ...
  ],
  logger: {
    // ...
  }
};

new Application(SOCKETIO_APP_OPTIONS).start();
```

### <a name="module-options"></a>  Module Options
The module accepts the following options::
- `host`: the server host, ex: `127.0.0.1` or `0.0.0.0` (for docker). By default is set to `localhost`
- `port`: the server port. By default is set to `4000`
- `maxListeners`: Max listeners attached to the connection. By default is set to 64

### <a name="server-events"></a>  Server Events
`SocketioServer` dispatches the following events:

- `ServerEvents.CONFIGURE` - triggered when server is created but not started, used to configure the `IO`, register native middleware ... etc.
- `ServerEvents.CONNECTED` - triggered when a client is connected.
- `ServerEvents.DISCONNECTED` - triggered when a client is disconnected.

for more details please check [`ConfigurationListener`](#configuration-listener) example.

### <a name="socketio-middleware"></a>  Socketio middleware
You can register a socketio middleware, which is a function that gets executed for every incoming Socket request.

```typescript
import {Injector} from 'injection-js';
import {EventEmitter} from 'events';

export function myCustomSocketioMiddleware(injector: Injector) {
  return (socket: EventEmitter, next: Function): void => {
    // do something
    next();
  };
}
```

The example below show you how to register `myCustomSocketioMiddleware` and how to work with `ServerEvents.CONNECTED` 
and `ServerEvents.DISCONNECTED` events.

### <a name="socketio-middleware"></a> Configuration listener

```typescript
import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents, ConnectionEvent} from '@rxstack/core';
import {Injectable, Injector} from 'injection-js';
import {SocketioServer} from '@rxstack/socketio-server';
import {EventEmitter} from 'events';

@Injectable()
export class ConfigurationListener {

  connectedUsers: EventEmitter[] = [];

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @Observe(ServerEvents.CONFIGURE)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.server.getName() !== SocketioServer.serverName) {
      return;
    }
    const io = event.server.getEngine();
    io.use(myCustomSocketioMiddleware(this.injector));
  }

  @Observe(ServerEvents.CONNECTED)
  async onConnect(event: ConnectionEvent): Promise<void> {
    if (event.server.getName() !== SocketioServer.serverName) {
      return;
    }

    this.connectedUsers.push(event.connection);
    event.server.getEngine().emit('hi', 'all');
  }

  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: ConnectionEvent): Promise<void> {
    if (event.server.getName() !== SocketioServer.serverName) {
      return;
    }

    let idx = this.connectedUsers.findIndex((current) => current === event.connection);
    if (idx !== -1) {
      this.connectedUsers.splice(idx, 1);
    }
  }
}
```

> You need to register `ConfigurationListener` in the application providers.


## License

Licensed under the [MIT license](../../LICENSE).