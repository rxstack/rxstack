# RxStack ExpressServer Module

> The ExpressServer module integrates [`expressjs`](https://expressjs.com) in rxstack framework.

## Installation

```
npm install @rxstack/express-server --save

// peerDependencies
npm install @rxstack/async-event-dispatcher@^0.3 @rxstack/core@^0.3 @rxstack/exceptions@^0.3
```

## Documentation

* [Setup](#setup)
* [Module options](#module-options)
* [Express options](#express-options)
* [Express middleware](#express-middleware)

### <a name="setup"></a>  Setup
`ExpressServer` module needs to be registered in the `application`. Let's create the application:

```typescript
import {Application, ApplicationOptions} from '@rxstack/core';
import {ExpressModule} from '@rxstack/express-server';

export const EXPRESS_APP_OPTIONS: ApplicationOptions = {
  imports: [
    ExpressModule.configure({
      'host': 'localhost',
      'port': 3000,
      'prefix': '/api'
    })
  ],
  servers: ['express'], //enables the server
  providers: [
    // ...
  ],
  logger: {
    // ...
  }
};

new Application(EXPRESS_APP_OPTIONS).start();
```

### <a name="module-options"></a>  Module Options
The module accepts the following options:
- `host`: the server host, ex: `127.0.0.1` or `0.0.0.0` (for docker). By default is set to `localhost`
- `port`: the server port. By default is set to `3000`
- `prefix`: the prefix for each route, ex: '/api/products. By default is set to `null`

### <a name="express-options"></a>  Express Options
In order to configure `expressjs` application you need to listen to `ServerEvents.CONFIGURE`.

```typescript
import {ServerEvents, ServerConfigurationEvent, InjectorAwareInterface} from '@rxstack/core';
import {ExpressServer} from '@rxstack/express-server';
import {Observe} from '@rxstack/async-event-dispatcher';
import {Injectable, Injector} from 'injection-js';
import {Application} from 'express';

@Injectable()
export class ConfigurationListener implements InjectorAwareInterface {

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }
  
  @Observe(ServerEvents.CONFIGURE)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.server.getName() !== ExpressServer.serverName) {
      return;
    }

    const app: Application = event.server.getEngine();
    
    // register any express middleware
  }
}
```

### <a name="express-middleware"></a>  Express Middleware
In addition to rxstack controllers you can register express middleware to you application.

> Important: If response is sent then native express middleware will bypass [`kernel`](../core/docs/kernel.md).

```typescript
import {
  Request as ExpressRequest, Response as ExpressResponse,
  NextFunction, RequestHandler
} from 'express';
import {Injector} from 'injection-js';

export function myCustomExpressMiddleware(injector: Injector): RequestHandler {
  return (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {
    response.json({'id': 'express'});
  };
}
```
You need to register `myCustomExpressMiddleware` in the `express` application by using `ConfigurationListener`.

```typescript
/// ... 

const app: Application;
app.get('/my-custom-express-middleware', expressMiddleware(this.injector));
```

> You need to register the listener in the application providers

You can get any of the registered services from `injector`.



## License

Licensed under the [MIT license](../../LICENSE).