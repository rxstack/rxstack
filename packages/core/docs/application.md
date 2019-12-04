# The Application

> The `application` is responsible for setting up modules and providers, bootstrap them and start the servers. 

## Documentation

* [Configurations](#configurations)
* [Modules](#modules)
* [Providers](#providers)
* [Bootstrap Event](#bootstrap-event)

### <a name="configurations"></a>  Configurations
`Application` can be configured by passing constructor arguments:

- `imports`: other modules to be imported in the application. 
- `providers`: provider definitions
- `servers`: an array of server names (server modules should be registered)

```typescript
import {ApplicationOptions} from '@rxstack/core'
import {ExpressModule} from '@rxstack/express-server';

export const APP_OPTIONS: ApplicationOptions = {
  imports: [ ExpressModule.configure({'port': 3200})],
  providers: [
    { provide: MyService, useClass: MyService }
  ],
  servers: ['express']
};

// creates an application instance
const app = new Application(APP_OPTIONS);

// bootstraps components
app.run().then((injector) => {
  // do something
});

// bootstraps components and runs command manager
app.cli().then((injector) => {
  // do something
});

// bootstraps components and starts the servers
app.start().then((app: Application) => {
  const injector = app.getInjector();
  // do something
});

// stops all servers
app.stop().then((app: Application) => {
  const injector = app.getInjector();
  // do something
});
```
### <a name="modules"></a>  Modules
Modules are reusable components plugged into your application. They are registered in the `ApplicationOptions`.

> Modules can not import other modules! If you need to check/get a service from another module, 
please check [bootstrap event](#bootstrap-event)

```typescript
import {Module, ModuleWithProviders} from '@rxstack/core'

@Module({
  providers: [
    { provide: MyCustomService, useClass: MyCustomService },
  ]
})
export class MyCustomModule { }

// register the module in the application
const app = new Application({
  // ...
  imports:[MyCustomModule]
});
```

with configurations:

```typescript
import {Module, ModuleWithProviders} from '@rxstack/core'

@Module()
export class MyCustomModule {
  static configure(configuration: MyCustomConfiguration): ModuleWithProviders {
    return {
      module: MyCustomModule,
      providers: [
        { provide: MyCustomService, useClass: MyCustomService },
      ]
    };
  }
}

// register the module in the application
const app = new Application({
  // ...
  imports:[MyCustomModule.configure({'option1': 'value1'})]
});
```


### <a name="providers"></a>  Providers
A provider is an instruction to the DI system on how to obtain a value for a dependency. 
Most of the time, these dependencies are services that you create and provide.
For more info please check [angular website](https://angular.io/guide/providers)

```typescript

import {Injectable} from 'injection-js';

@Injectable()
export class MyService { }


// register the providers in the application
const app = new Application({
  // ...
  providers:[{ provide: MyService, useClass: MyService }]
});

```

Angular does not support async providers, here is a hacky way of registering them:

```typescript
import {Provider} from 'injection-js';

const asyncProvider =  async function(options: any): Promise<Provider> {
  const connection = await createConnection(options);
  return { provide: 'db_connection', useValue: connection};
};


// register the providers in the application
const app = new Application({
  // ...
  providers:[asyncProvider({'option': 'value'})]
});

```

### <a name="bootstrap-event"></a>  Bootstrap Event
`Bootstrap event` gives you an opportunity to manipulate other services that have been registered with the injector. 
It is dispatched right after all providers are resolved and registered in the DI.

Here is an example how you can create a service and inject in other services by using `setters`:

```typescript
import {Injectable, ResolvedReflectiveProvider} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ApplicationEvents} from '@rxstack/core';

@Injectable()
export class BootstrapListener {

  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    // create a service
    const myService = event.injector.resolveAndInstantiate({
      provide: MyService,
      useClass: MyService
    });

    event.resolvedProviders.forEach((resolvedProvider: ResolvedReflectiveProvider) => {
      const service = event.injector.get(resolvedProvider.key.token, false);
      if (service && typeof service['setMyService'] === 'function') {
        service['setMyService'](myService);
      }
    });
  }
}

```