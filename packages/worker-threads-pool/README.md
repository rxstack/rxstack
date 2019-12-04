# RxStack Worker Threads Pool Module

> Offload tasks to a pool of workers in rxstack application.

## Installation

```
npm install @rxstack/worker-threads-pool --save

// peerDependencies
npm install @rxstack/core@^0.5 @rxstack/exceptions@^0.5 winston@^3.2.1
```

## Documentation

* [Setup](#setup)
* [Module options](#module-options)
* [Create a task](#task-create)
* [Run a task](#task-run)
* [API](#api)

### <a name="setup"></a>  Setup
`WorkerThreadsPool` module is installed and configured by default in [`skeleton`](https://github.com/rxstack/skeleton) application.

### <a name="module-options"></a>  Module Options
The module accepts the following options::
- `path`: path to executable .js file
- `max`: Maximum number of workers allowed in the pool. Defaults to 1
- `maxWaiting`: Maximum number of workers waiting to be started when the pool is full. 
   It will trigger an exception if limit is reached. Defaults to 10
   
### <a name="task-create"></a>  Create a task
Each task should extends `AbstractWorkerThread` class:

```typescript
// ./src/app/workers/my-task.ts
import {AbstractWorkerThread} from '@rxstack/worker-threads-pool';
import {Injectable} from 'injection-js';
import {parentPort, workerData} from 'worker_threads';

@Injectable()
export class MyTask extends AbstractWorkerThread {

  async run(): Promise<void> {
    parentPort.postMessage(`hello ${workerData.options.message} - from worker`);
  }

  getName(): string {
    return 'my-task';
  }
}
```

then register it in the application providers:

```typescript
// ./src/app/workers/APP_WORKER_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {WORKER_THREADS_POOL_REGISTRY} from '@rxstack/worker-threads-pool';
import {MyTask} from './my-task';

export const APP_WORKER_PROVIDERS: ProviderDefinition[] = [
  // ...
  {
    provide: WORKER_THREADS_POOL_REGISTRY,
    useClass: MyTask,
    multi: true
  }
];
```

now your task is ready to be run.

### <a name="task-run"></a>  Run a task
you can run a task from anywhere. In the example below we'll run it from a controller 
and communicate with the connected client via socket connection:

```typescript
import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface, Request, Response, WebSocket} from '@rxstack/core';
import {WorkerThreadsPool} from '@rxstack/worker-threads-pool';

@Injectable()
export class IndexController implements InjectorAwareInterface {

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @WebSocket('app_index')
  async indexAction(request: Request): Promise<Response> {
    const pool = this.injector.get(WorkerThreadsPool);
    
    pool.acquire('my-task', {massage: 'world'}).then((worker) => {
      worker.on('message', (data: any) => {
        // communication between client and worker via sockets
        request.connection.emit('message', data);
      });
      worker.on('online', (err: any) => {
        // task is started
        request.connection.emit('message', 'task is started');
      });
      worker.on('error', (err: any) => {
        // handle errors
        request.connection.emit('message', err.message);
      });
      worker.on('exit', (code) => {
        // task is completed
        request.connection.emit('message', code === 0 ? 'success' : 'fail');
      });
    }).catch(e => console.error(e.message));
    
    return new Response('Task is scheduled', 202);
  }
}
```

### <a name="api"></a>  API

#### `pool.acquire(name, [options])`

- `name`: task name, 
- `options`(optional): data passed to `workerData`
    
returns a promise of `Worker` or throws an exception if task does not exist or queue is full.
    
#### `pool.stats()`

returns `workerSize` and `queueSize`

#### `pool.terminate()`
 
clears the queue and terminates all running workers

## License

Licensed under the [MIT license](../../LICENSE).