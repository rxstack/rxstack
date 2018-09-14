# The Logger

> RxStack integrates seamlessly with [`Winston`](https://github.com/winstonjs/winston), 
the most popular nodejs logging library, 
to create and store log messages in a variety of different places.
               
## Documentation
The logger has a stack of handlers (implementation of
 [winston transports](https://github.com/winstonjs/winston/blob/2.4.0/docs/transports.md)), 
 and each can be used to write the log entries to different locations.

* [Configuration](#configuration)
* [Logging messages](#logging)
* [Build-in handles](#build-in-handlers)
    - [console](#console-handler)
    - [file](#file-handler)
* [How to create a custom handler](#custom-handler)

### <a name="configuration"></a>  Configuration
You need to pass logger registered handlers when creating an application instance:

```typescript
    import {Application} from '@rxstack/core'
  
    // register the module in the application
    const app = new Application({
      // ...
      logger: {
        'handlers': [
          {
            type: 'console',
            options: {
              level: 'silly',
            }
          }
        ]
      }
    });
```

Each handler has the following arguments:
- type: handler name
- options: specific `winston` options

For more details check [build-in handlers](#build-in-handlers)

### <a name="logging"></a>  Logging messages

```typescript
    import {Logger} from '@rxstack/core';

    // ...
    const logger = injector.get(Logger);
    
    logger.info('I just got the logger');
    logger.error('An error occurred', 'some context');
   
```

Here is a list of all of the methods on the logger: `'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly'`

### <a name="build-in-handlers"></a>  Build-in handlers
`Logger` comes with two build in handlers: `console` and `file`

##### <a name="console-handler"></a>  Console handler
`console` handler prints messages to stdout or stderr. 
[Please check winston options](https://github.com/winstonjs/winston/blob/2.4.0/docs/transports.md#console-transport)

##### <a name="file-handler"></a>  File handler
`file` handler writes messages to a file using a stream.
[Please check winston options](https://github.com/winstonjs/winston/blob/2.4.0/docs/transports.md#file-transport)

### <a name="custom-handler"></a>  How to create a custom handler
Creating a custom handler is relatively simple. You need to implement 
[`LoggerTransportInterface`](https://github.com/rxstack/rxstack/blob/master/packages/core/src/logger/interfaces.ts). 
It needs also to be registered in the application providers:

```typescript

import {LOGGER_TRANSPORT_REGISTRY} from '@rxstack/core';

// ...
providers: [
  { provide: LOGGER_TRANSPORT_REGISTRY, useClass: MyCustomHandler, multi: true },
],
logger: {
  'handlers': [
    {
      type: 'my-custom-handler',
      options: {
        level: 'silly',
      }
    }
  ]
}
```

The best tutorial is to study how build-in logger handlers are created:
- [console](https://github.com/rxstack/rxstack/blob/master/packages/core/src/logger/transports/console.transport.ts)
- [file](https://github.com/rxstack/rxstack/blob/master/packages/core/src/logger/transports/file.transport.ts)

