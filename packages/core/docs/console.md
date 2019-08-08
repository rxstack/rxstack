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
  }
};

// creates application instance
const app = new Application(APP_OPTIONS);
// bootstraps components and starts the application in cli environment
app.cli().catch(console.err);
```

### <a name="list-commands"></a>  List available commands

To execute our custom command you need to run: 

```bash
$ ts-node ./cli.ts -h
```

### <a name="run-command"></a>  Running a command
To execute our custom command you need to run: 

```bash
$ ts-node ./cli.ts my-custom-command -f true
```

> Pay attention that we execute commands with `ts-node` instead of `node`

