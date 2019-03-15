# The Console

> The Console component allows you to create a command-line application. Your console commands can be used for
 any recurring task, such as cronjobs, imports, or other batch jobs. 
               
## Documentation
Console application bootstraps all registered `providers` and `modules` but does not initialize any `servers`.
Under the hood it uses [`yargs`](https://github.com/yargs/yargs).

* [Creating a command](#create-command)
* [Starting console application](#start-application)
* [List available commands](#list-commands)
* [Running a command](#run-command)

### <a name="create-command"></a>  Creating a command
All commands extend `AbstractCommand` class. Let's create one:

```typescript

import {Injectable} from 'injection-js';
import {AbstractCommand} from '@rxstack/core';

@Injectable()
export class MyCustomCommand extends AbstractCommand {
  command = 'my-custom-command'; // unique command name
  describe = 'My custom command description.'; // command description
  builder = (yargs: any) => {
    yargs.option('f', {
      describe: 'Describe the option here',
      default: false,
      type: 'boolean',
      alias: 'force',
    });
  }

  async handler(argv: any): Promise<void> {
    const force: boolean = argv.force;
    const myService = this.injector.get(MyService);
    // do something
    process.exit();
  }
}

```

### <a name="start-application"></a>  Starting the console application
Let's create the console application in `cli.ts` and register our custom command:

```typescript
import 'reflect-metadata';
import {ApplicationOptions} from '@rxstack/core'

export const APP_OPTIONS: ApplicationOptions = {
  providers: [
    { provide: MyService, useClass: MyService },
    { provide: COMMAND_REGISTRY, useClass: MyCustomCommand, multi: true },
  ],
  logger: {
    'handlers': [
      {
        type: 'console',
        options: {
          level: 'silly',
        }
      }
    ]
  },
  console: true
};

// creates application instance
const app = new Application(APP_OPTIONS);
// bootstraps components and starts the servers
await app.start();
```

### <a name="list-commands"></a>  List available commands

We first need to build the source. Let's assume that source is built in `/dist`.
To execute our custom command you need to run: 

```bash
$ node ./dist/cli.js -h
```

### <a name="run-command"></a>  Running a command
To execute our custom command you need to run: 

```bash
$ node ./dist/cli.js my-custom-command -f true
```

