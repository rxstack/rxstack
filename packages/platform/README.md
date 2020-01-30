# The RxStack Platform Module

> Rapid Application Development platform to build modern API-driven projects, built on top of rxstack framework.

> Switch to [RxStack Framework](https://github.com/rxstack/rxstack)

## Table of content

- [Installation](#installation)
- [Documentation](#documentation)
- [Models](#models)
- [Services](#services)
    - [Options](#services-options)
    - [Methods](#services-methods)
        - [insertOne](#services-methods-insertOne)
        - [insertMany](#services-methods-insertMany)
        - [updateOne](#services-methods-updateOne)
        - [updateMany](#services-methods-updateMany)        
        - [removeOne](#services-methods-removeOne)
        - [removeMany](#services-methods-removeMany)
        - [find](#services-methods-find)
        - [findOne](#services-methods-findOne)
        - [findMany](#services-methods-findMany)
    - [Querying](#services-querying)
    - [Adapters](#services-adapters)
- [Operations](#operations)
    - [List](#operations-list)
    - [Create](#operations-create)
    - [Get](#operations-get)
    - [Update](#operations-update)
    - [Patch](#operations-patch)
    - [Remove](#operations-remove)
    - [BulkRemove](#operations-bulk-remove)
    - [BulkCreate](#operations-bulk-create)
- [Hooks](#hooks)
- [Overwrite Operations](#overwrite-operations)
- [Custom Operations](#custom-operations)
    - [Metadata](#custom-operations-metadata)
    - [Implementation](#custom-operations-implementation)
- [Testing](#testing)
    - [Operations](#testing-operations)
    - [Hooks](#testing-hooks)
- [Add-ons](#add-ons)
    - [Security](#add-ons-security)
        - [User Provider](#add-ons-security-user-provider)
        - [Refresh Token Manager](#add-ons-security-refresh-token-manager)

## <a name="installation"></a>  Installation

First you need to clone [rxstack skeleton application](https://github.com/rxstack/rxstack#installation). 

```
git clone https://github.com/rxstack/skeleton.git my-project

cd my-project

npm install
```

After you cloned `skeleton application` you need to install the platform:

```
npm install @rxstack/platform --save
```

> you need also to install peer dependencies (of not installed already):

```
npm install @rxstack/async-event-dispatcher@^0.5 @rxstack/core@^0.6 @rxstack/exceptions@^0.5 @rxstack/query-filter@^0.5 @rxstack/security@^0.6 winston@^3.2.1
```

Now register the module in the `APP_OPTIONS`

```typescript
import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule} from '@rxstack/platform';

export const APP_OPTIONS: ApplicationOptions = {
  imports: [
    // ...
    PlatformModule,
  ]
};
```

## <a name="documentation"></a> Documentation
These steps will guide you through creating your first appication.

> Before you start you need to have basic understanding of RxStack framework

## <a name="models"></a> Models
`Model` is a simple typescript `interface`. Let's create our first model:

> Models are not required but it is a good practice to define them

```typescript
// src/app/resources/task/task.model.ts

export interface TaskModel {
  id: string;
  name: string;
  completed: boolean;
}
```

## <a name="services"></a> Services
Services provide a uniform, protocol independent interface for reading or writing data. 
Every service implements [`ServiceInterface`](src/interfaces.ts).

### <a name="services-options"></a> Options:

The base options are:

- `idField`: unique entity identifier
- `defaultLimit`: limit of the fetched entities

> There'll be additional options depending on adapter

### <a name="services-methods"></a> Methods
Service methods are pre-defined [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations.

> Each service method has optional parameter `options` which might be passed to the native driver.

#### <a name="services-methods-insertOne"></a> insertOne
Creates a new entry. The method should return a Promise with the newly created entry.

```typescript
const data: Object; // entry data
const newEntry = await service.insertOne(data);
```

#### <a name="services-methods-insertMany"></a> insertMany
Creates entries. The method should return a Promise with the newly created entries.

```typescript
const data: Object[]; // entries data
const newEntries = await service.insertMany(data);
```

#### <a name="services-methods-updateOne"></a> updateOne
Replaces the entry by id. The method should return a Promise.

```typescript
const id: any; // entry id
const data: Object; // entry data
const entry = await service.updateOne(id, data);
```

#### <a name="services-methods-updateMany"></a> updateMany
Patches entries by [criteria](#service-querying).
The method should return a Promise with number of updated entries.

```typescript
const criteria = {
  id: { '$in': ['id-1', 'id-2'] }
};
const data: Object = { completed: true }; 
const affectedEntries = await service.updateMany(criteria, data);
```

#### <a name="services-methods-removeOne"></a> removeOne
Deletes the entry by id. The method should return a Promise.

```typescript
const id: any; // entry id
await service.removeOne(id);
```

#### <a name="services-methods-removeMany"></a> removeMany
Deletes entries by [criteria](#service-querying).
The method should return a Promise with number of deleted entries.

```typescript
const criteria = {
  id: { '$in': ['id-1', 'id-2'] }
};
const affectedEntries = await service.removeMany(criteria);
```

#### <a name="services-methods-count"></a> count
Counts entries by optional parameter [criteria](#service-querying).
The method should return a Promise with number of entries.

```typescript
const criteria = {
  id: { '$in': ['id-1', 'id-2'] }
};
const cnt = await service.count(criteria);
```
#### <a name="services-methods-find"></a> find
Find entry by id. The method should return a Promise with the found entry or null.

```typescript
const entry = await service.find(id);
```

#### <a name="services-methods-findOne"></a> findOne
Finds a single entry by [criteria](#service-querying).
The method should return a Promise with the found entry or null.

> Always returns the first found entry

```typescript
const criteria = {
  id: { '$in': ['id-1'] }
};
const entry = await service.findOne(criteria);
```

#### <a name="services-methods-findMany"></a> findMany
Finds, limits, slices and sorts entries by [query](#service-querying).
The method should return a Promise with found entries.

```typescript
const query = {
  where: {
    id: { '$in': ['id-1', 'id-2'] },
    limit: 10,
    skip: 0,
    sort: {id: -1}
  },
};
const entries = await service.findMany(criteria);
```


### <a name="services-querying"></a> Querying
Querying is done via [`@rxstack/query-filter`](https://github.com/rxstack/rxstack/tree/master/packages/query-filter) component.

- `findMany` accepts [QueryInterface](https://github.com/rxstack/rxstack/blob/master/packages/query-filter/src/interfaces.ts).
- `findOne`, `updateMany`, `removeMany` and `count` accept criteria object with `@rxstack/query-filter` operators.
- `find` query by entity identifier

### <a name="services-adapters"></a> Adapters
Official adapters:

- [memory-service](https://github.com/rxstack/memory-service)
- [mongoose-service](https://github.com/rxstack/mongoose-service)
- [sequelize-service](https://github.com/rxstack/sequelize-service)

For the sake of simplicity in the example below we're going to use `@rxstack/memory-service`.

> You need to [install and configure the module](https://github.com/rxstack/memory-service#installation).

Let's create `TaskService`:

```typescript
// src/app/resources/task/task.service.ts

import {TaskModel} from './task.model';
import {Injectable} from 'injection-js';
import {MemoryService} from '@rxstack/memory-service';

@Injectable()
export class TaskService extends MemoryService<TaskModel> {
  // you can add more methods or overwrite the existing ones
}
```

> we need to register the service:

```typescript
// src/app/resources/task/APP_TASK_PROVIDERS.ts

import {ProviderDefinition} from '@rxstack/core';
import {TaskService} from './task.service';

export const APP_TASK_PROVIDERS: ProviderDefinition[] = [
  // ...
  {
    provide: TaskService,
    useFactory: () => new TaskService({
      idField: 'id', defaultLimit: 25, collection: 'tasks'
    }),
    deps: [],
  },
];
```

> Make sure APP_TASK_PROVIDERS are registered  in the APP_OPTIONS


### <a name="operations"></a> Operations
An operation is a link between a `Resource`, `Service` and `Action Controller`. 
Each operation supports `preExecute` and `postExecute` hooks. 
You can use these middleware to modify query, validate, authorize etc...

The platform is shipped with [a set of helpers](https://github.com/rxstack/platform-callbacks) you can use in your daily work.

The following operations are supported by the platform:

> All operations need to be registered in the application providers!

#### <a name="operations-list"></a> List
Fetches entries from the data storage

> Operation uses service method [`findMany`](#service-methods-findMany).

```typescript
// src/app/resources/task/task-list.operation.ts

import {
  AbstractResourceOperation,
  Operation,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskModel} from './task.model';
import {TaskService} from './task.service';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.LIST,
  name: 'app_task_list',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks', // required only if using HTTP transport
  service: TaskService,
})
export class TaskListOperation extends AbstractResourceOperation<TaskModel> { }
```

and register it in the task providers:

```typescript
import {ProviderDefinition} from '@rxstack/core';
import {TaskListOperation} from './task-list.operation';

export const APP_TASK_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: TaskListOperation, useClass: TaskListOperation }
];
```

cURL:
```bash
curl -X GET \
  http://0.0.0.0:3000/tasks \
  -H 'Accept: application/json'
```

##### Pagination

To enable pagination:

```typescript
@Operation<ResourceOperationMetadata<Task>>({
  // ...
  pagination: {
    enabled: true, 
    limit: 10 //optional, default to limit defined in the service
  }
})
```

Pagination data is located in `request.attributes.get('pagination')`. To overwrite it use `postExecute` hook.

```typescript
@Operation<ResourceOperationMetadata<Task>>({
  // ...
  onPostExecute: [
    async (event: OperationEvent): Promise<void> => {
      const pagination: Pagination = event.request.attributes.get('pagination');
      // do something with pagination
      event.request.attributes.set('pagination', pagination);
    }
  ]
})
```

On `kernel.response` event headers are set in the `Response`:

- `x-total`
- `x-limit`
- `x-skip`

cURL:

```bash
curl -X GET \
  http://0.0.0.0:3000/tasks?$limit=10&$skip=0 \
  -H 'Accept: application/json'
```

#### Applying query filters

Query object is stored in `request.attributes.get('query')`. To overwrite it use `preExecute` hook.

```typescript
@Operation<ResourceOperationMetadata<Task>>({
  // ...
  preExecute: [
    // ...
    async (event: OperationEvent): Promise<void> => {
      const query: QueryInterface = event.request.attributes.get('query');
      event.request.attributes.set('query', {...query, ...{'where': {'completed': {'$eq': true}}}});
    }
  ]
})
```

> For advanced querying use [@rxstack/platform-callbacks](https://github.com/rxstack/platform-callbacks)
In that case you'll be able to apply query filters from request parameters, security token ...


cURL:
```bash
curl -X GET \
  'http://0.0.0.0:3000/tasks?id[$in]=1,2'
```
#### <a name="operations-create"></a> Create
Create a new data entry.

> Operation uses service method [`insertOne`](#service-methods-insertOne).


```typescript
// src/app/resources/task/create-task.operation.ts

import {
  AbstractResourceOperation,
  Operation,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskModel} from './task.model';
import {TaskService} from './task.service';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.CREATE,
  name: 'app_task_create',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks', // required only if using HTTP transport
  service: TaskService
})
export class TaskCreateOperation extends AbstractResourceOperation<TaskModel> { }
```

You need to register in the providers.

> For validation and etc. use [@rxstack/platform-callbacks](https://github.com/rxstack/platform-callbacks)

cURL:
```bash
curl -X POST \
  http://0.0.0.0:3000/tasks \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
	"name": "task-1",
	"completed": false
}'
```

#### <a name="operations-get"></a> Get
Get a single data entry by its unique identifier.

> Operation uses service method [`find`](#service-methods-find).

```typescript
// src/app/resources/task/get-task.operation.ts

import {
  AbstractResourceOperation,
  Operation,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskService} from './task.service';
import {TaskModel} from './task.model';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.GET,
  name: 'app_task_get',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks/:id', // required only if using HTTP transport
  service: TaskService,
})
export class TaskGetOperation extends AbstractResourceOperation<TaskModel> { }
```

> For transformation and etc. use [@rxstack/platform-callbacks](https://github.com/rxstack/platform-callbacks)

cURL:

```bash
curl -X GET \
  http://localhost:3000/tasks/task-1 \
  -H 'Content-Type: application/json'
```

By default it looks for `request.param.get('id')`. To replace the query just overwrite`findOneOr404`.

```typescript
import {Request} from '@rxstack/core';
import {NotFoundException} from '@rxstack/exceptions';
// ...
export class TaskGetOperation extends AbstractResourceOperation<Task> {
  protected async findOneOr404(request: Request): Promise<TaskModel> {
    // replacing `find` with `findOne`
    const resource = await this.getService()
      .findOne({'id': {'$eq': request.params.get('id')}, 'completed': {'$eq': true}});
    if (!resource) {
      throw new NotFoundException();
    }
    return resource;
  }
}
```

#### <a name="operations-update"></a> Update

Update an existing data entry by completely replacing it.
Entry needs to be fetched from data storage before updated. To replace the query just overwrite`findOneOr404`.

> Operation uses service method [`updateOne`](#service-methods-updateOne).

```typescript
import {
  AbstractResourceOperation,
  Operation,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskService} from './task.service';
import {TaskModel} from './task.model';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.UPDATE,
  name: 'app_task_update',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks/:id',
  service: TaskService
})
export class TaskUpdateOperation extends AbstractResourceOperation<TaskModel> { }
```

cURL:
```bash
curl -X PUT \
  http://localhost:3000/tasks/task-1 \
  -H 'Content-Type: application/json' \
  -d '{
	"name": "task 1.1",
	"completed": "true"
}'
```

#### <a name="operations-patch"></a> Patch
Update one or more data entries by merging with the new data. By default it looks for `request.params.get('ids')` but
you can replace criteria using `preExecute` hook.

> Operation uses service method [`updateMany`](#service-methods-updateMany).

> `request.params.get('ids')` should be converted to array, ex: `request.params.get('ids').split(',')`

```typescript
import {
  AbstractResourceOperation,
  Operation, OperationEvent,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskService} from './task.service';
import {TaskModel} from './task.model';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.PATCH,
  name: 'app_task_patch',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks/:custom_param',
  service: TaskService,
  onPreExecute: [
    async (event: OperationEvent): Promise<void> => {
      event.request.attributes.set('criteria', {
        'id': { '$eq': event.request.params.get('custom_param') }
      });
    }
  ]
})
export class TaskPatchOperation extends AbstractResourceOperation<TaskModel> { }
```

cURL:
```bash
curl -X PATCH \
  http://localhost:3000/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{
	"completed": true
}'
```

#### <a name="operations-remove"></a> Remove
Remove single entry. By default it looks for `request.param.get('id')`. You can use `findOneOr404` to overwrite it.

> Operation uses service method [`removeOne`](#service-methods-removeOne).

```typescript
import {
  AbstractResourceOperation,
  Operation,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskService} from './task.service';
import {TaskModel} from './task.model';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.REMOVE,
  name: 'app_task_remove',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks/:id',
  service: TaskService
})
export class TaskRemoveOperation extends AbstractResourceOperation<TaskModel> { }
```
cURL:
```bash
curl -X DELETE \
  http://localhost:3000/tasks/id-1
```

#### <a name="operations-bulk-create"></a> Bulk Create
Create many entries at once.

> Operation uses service method [`insertMany`](#service-methods-bulkCreate).

```typescript
import {
  AbstractResourceOperation,
  Operation,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskService} from './task.service';
import {TaskModel} from './task.model';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.BULK_CREATE,
  name: 'app_task_bulk_create',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks-bulk-create',
  service: TaskService
})
export class TaskBulkCreateOperation extends AbstractResourceOperation<TaskModel> { }
````
cURL:
```bash
curl -X POST \
  http://localhost:3000/tasks-bulk-create \
  -H 'Content-Type: application/json' \
  -d '[
	{
		"name": "task-1",
		"completed": true
	},
	{
		"name": "task-2",
		"completed": false
	}
]'
```
#### <a name="operations-bulk-remove"></a> Bulk Remove
Remove many entries at once. By default it looks for `request.params.get('ids')` but
you can replace criteria using `preExecute` hook.

> Operation uses service method [`removeMany`](#service-methods-removeMany).

```typescript
import {
  AbstractResourceOperation,
  Operation,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskService} from './task.service';
import {TaskModel} from './task.model';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.BULK_REMOVE,
  name: 'app_task_bulk_remove',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks-bulk-delete',
  service: TaskService
})
export class TaskBulkRemoveOperation extends AbstractResourceOperation<TaskModel> { }
````

cURL:
```
curl -X DELETE \
  http://localhost:3000/tasks-bulk-delete?ids=1,2
```

> `request.params.get('ids')` should be converted to array, ex: `request.params.get('ids').split(',')`

### <a name="hooks"></a> Hooks
Hooks are async middleware functions that can be registered in operations. You can use them to validate, authorize and etc...
At the end they are converted to [`observers`](https://github.com/rxstack/rxstack/tree/master/packages/async-event-dispatcher).
Function accepts a single parameter `event` which is instance of [`OperationEvent`](https://github.com/rxstack/rxstack/blob/master/packages/platform/src/events/operation.event.ts)
and returns `Promise<void>`.

`OperationEvent` extends [`GenericEvent`](https://github.com/rxstack/rxstack/blob/master/packages/async-event-dispatcher/src/generic-event.ts) 
and contains the following properties and methods.

- `request`: current request
- `injector`: dependency injector
- `metadata`: operation readonly metadata
- `statusCode`: sets status code of the `Response` object
- `eventType`: `preExecute`, `postExecute` or user-defined type.
- `setData`: with this method you can set data before passed to `Response` object.
- `getData`: retrieve the data set by the operation methods
- `response`: if you set the response then it will immediately [stop propagation](https://github.com/rxstack/rxstack/tree/master/packages/async-event-dispatcher#stopping-event-flow/propagation)
 and will send the response to the client. 
 
 ```typescript
 // ...
onPreExecute: [
  async (event: OperationEvent): Promise<void> => { 
    // do something on preExecute
  },
],
onPostExecute: [
  async (event: OperationEvent): Promise<void> => { 
    // do something on postExecute
  },
]
 ```
 
You can also register observers instead of hooks. The event name consists `operation.name` and `eventType`
 
```typescript
import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {OperationEvent} from '@rxstack/platform';

@Injectable()
export class TaskObserver {
  @Observe('app_task_create.pre_execute', 100)
  async onPreExecute(event: OperationEvent): Promise<void> {
    // do something
  }
}
```

> Do not forget to register it in the application providers.

You can execute a collection of hooks as a single hook, and then you can use it in multiple operations:

```typescript
import {
  associateWithCurrentUser,
  restrictToRole, setNow,
} from '@rxstack/platform-callbacks';

export const taskPreExecuteCallback = (): OperationCallback => {
  return async (event: OperationEvent): Promise<void> => { 
    // first
    await restrictToRole('ROLE_ADMIN')(event);
    // second
    await associateWithCurrentUser({
      idField: 'username',
      targetField: 'createdBy'
    })(event);
    // third
    await setNow('createdAt')(event);
};
  
// in operation metadata
onPreExecute: [
  taskPreExecuteCallback()
]
```
 
> For more information how to create configurable hooks [check these example](https://github.com/rxstack/platform-callbacks/tree/master/src)

### <a name="overwrite-operations"></a> Overwrite operations
The easies way to overwrite default behavior of operation is to use `preExecute` and `postExecute` hooks. You can also overwrite
`doExecute` method.

> `doExecute` is called by all operations including the custom ones.

```typescript
import {
  AbstractResourceOperation,
  Operation, OperationEvent,
  ResourceOperationMetadata,
  ResourceOperationTypesEnum
} from '@rxstack/platform';
import {TaskService} from './task.service';
import {TaskModel} from './task.model';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.CREATE,
  name: 'app_task_create',
  transports: ['SOCKET'],
  service: TaskService,
})
export class CreateTaskOperation extends AbstractResourceOperation<TaskModel> {
  protected async doExecute(event: OperationEvent): Promise<void> {
    // apply you logic here
    // event.setData(your data) - to set the result
  }
}
```
### <a name="custom-operations"></a> Custom Operations
In some cases specific operations are needed for example  to send an email, then custom operation comes in place.

#### <a name="custom-operations-metadata"></a> Metadata
Each operation needs a metadata.[OperationMetadata](https://github.com/rxstack/rxstack/blob/master/packages/platform/src/metadata/operation.metadata.ts) 
can be used or if additional configurations are needed then it can be extended.

```typescript
import {OperationCallback, OperationMetadata} from '@rxstack/platform';
import {Type} from 'injection-js/facade/type';
import {InjectionToken} from 'injection-js';

export interface MailerServiceInterface {
  send(recipient: string, template: string, data: Object): Promise<void>;
}

export interface SendMailOperationMetadata extends OperationMetadata {
  onPreSend?: OperationCallback[]; // custom hook
  onPostSend?: OperationCallback[]; // another custom hook
  recipient: string;
  mailerService: Type<MailerServiceInterface> | InjectionToken<MailerServiceInterface>;
  template: string;
}
```

> If you want to register other observers then you need to add a property 
in metadata starting with `^on`. For example: `onPreSend` or `onPostSend`. They will be automatically registered with the event dispatcher.

#### <a name="custom-operations-implementation"></a> Implementation 
Each operation must extend `AbstractOperation`. Async method `doExecute` is called every time an operation is executed. 

Workflow: `preExecute` -> `doExecute` -> `postExecute`
 
Let's create our abstract custom operation `SendMailOperation`:

```typescript
import {AbstractOperation, OperationEvent} from '@rxstack/platform';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';

export abstract class SendMailOperation extends AbstractOperation {
  metadata: SendMailOperationMetadata;

  protected async doExecute(event: OperationEvent): Promise<void> {
    const mailService = this.injector.get(this.metadata.mailerService);
    const dispatcher = event.injector.get(AsyncEventDispatcher);

    await dispatcher.dispatch(this.metadata.name + '.' + 'preSend');
    await mailService.send(this.metadata.recipient, this.metadata.template, event.request.params.toObject());
    await dispatcher.dispatch(this.metadata.name + '.' + 'postSend');
  }
}
```

and now the implementation:

```typescript
@Operation<SendMailOperationMetadata>({
  name: 'send_email',
  transports: ['SOCKET'],
  recipient: 'someone@example.com',
  mailerService: MailerService, // service that implement MailerServiceInterface
  template: `
    Hello world
  `,
  onPreSend: [
    async (event: OperationEvent): Promise<void> => {
      // do something
    }
  ],
  onPostSend: [
    async (event: OperationEvent): Promise<void> => {
      // do something
    }
  ]
})
@Injectable()
export class SendMailOperationImpl extends SendMailOperation { }
```

> Do not forget to register it in the application providers

As you see you can create any type of configurable operations with ease.

### <a name="testing"></a> Testing
Automated tests are very important part of application development. 

####  <a name="testing-operations"> Operation Testing
We are going to use integration tests. You just need to get the `definition` from the `kernel`.

> There is no need of running server.

```typescript
import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {APP_OPTIONS} from '../src/app/APP_OPTIONS';

describe('Platform:Operation:Create', () => {
  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  before(async() =>  {
    injector = await app.run();
    kernel = injector.get(Kernel);  
  });


  it('@app_task_create', async () => {
    // getting the http definition
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_create');
    // building the request
    const request = new Request('HTTP');
    request.body = { 'name': 'my task', 'completed': false };
    // getting the response
    const response: Response = await def.handler(request);
    // testing against the response data
    response.statusCode.should.equal(201);
    response.content['name'].should.equal('my task');
  });
});

```

#### <a name="testing-hooks"> Hook Testing 
We are going to use unit testing with `sinon`.

```typescript
import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Request} from '@rxstack/core';
import {OperationEvent, OperationEventsEnum, ResourceOperationMetadata} from '@rxstack/platform';
import {TaskModel} from '../src/app/resources/task/task.model';

const sinon = require('sinon');
// create injector
const injector = sinon.createStubInstance(Injector);
// create metadata
const app_create_metadata = { } as ResourceOperationMetadata<TaskModel>;

const customHook = () => {
  return async (event: OperationEvent) => {
    event.setData('something');
  };
};

describe('My Hook', () => {
  it('should output something', async () => {
    // build the request
    const request = new Request('HTTP');
    // build the event
    const apiEvent = new OperationEvent(request, injector, app_create_metadata);
    apiEvent.eventType = OperationEventsEnum.POST_EXECUTE;

    // pass event to the hook and execute it.
    await customHook()(apiEvent);

    // test againt event data
    apiEvent.getData().should.equal('something');
  });
});
```

[read more about testing](https://github.com/rxstack/rxstack#testing)


### <a name="add-ons"> Add-ons
Add-ons are the bridge between platform services and third-party modules.

#### <a name="add-ons-security"> Security add-ons
Security services help you build security layer of your application.

> You need to install [`SecurityModule`](https://github.com/rxstack/rxstack/tree/master/packages/security#setup) in order to 
use these add-ons

##### <a name="add-ons-security-user-provider">  User Provider
`UserProvider` is implementation of [`@rxstack/security`](https://github.com/rxstack/rxstack/tree/master/packages/security#user-providers)
`UserProviderInterface`

At first place you need to create `UserService` and `UserModel`:

```typescript
import {User} from '@rxstack/security';

export class UserModel extends User {
  id: string;
}
```

and `UserService`

```typescript
import {Injectable} from 'injection-js';
import {MemoryService} from '@rxstack/memory-service';
import {UserModel} from './user.model';

@Injectable()
export class UserService extends MemoryService<UserModel> {
  // you can add more methods or overwrite the existing ones
}
```

In the `APP_OPTIONS` you need to register `UserProvider` and `UserService`:

```typescript
export const APP_OPTIONS: ApplicationOptions = {
  imports: [
    // ...
  ],
  providers: [
  {
    provide: UserService,
    useFactory: () => new UserService({
      idField: 'id', defaultLimit: 25, collection: 'users'
    }),
    deps: [],
  },
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: (userService: UserService) => {
      return new UserProvider<UserModel>(userService, 'username');
    },
    deps: [UserService],
    multi: true
  },
};
```

That's all.

##### <a name="add-ons-security-refresh-token-manager">  Refresh Token Manager
`RefreshTokenManager` is implementation of [`@rxstack/security`](https://github.com/rxstack/rxstack/tree/master/packages/security#refresh-token-manager)
`AbstractRefreshTokenManager`

At first place you need to create `RefreshTokenService` and `RefreshTokenModel`, [learn more about services](#services)

In the `APP_OPTIONS` you need to register `RefreshTokenManager`:

```typescript
export const REFRESH_TOKEN_SERVICE = new InjectionToken<ServiceInterface>('REFRESH_TOKEN_SERVICE');

export const APP_OPTIONS: ApplicationOptions = {
  imports: [
    // ...
  ],
  providers: [
    {
      provide: REFRESH_TOKEN_SERVICE,
      useFactory: () => new MemoryService({
        idField: '_id', defaultLimit: 25, collection: 'refreshTokens'
      }),
      deps: [],
    },
    {
      provide: REFRESH_TOKEN_MANAGER,
      useFactory: (refreshTokenService: ServiceInterface<RefreshTokenInterface>, tokenEncoder: TokenEncoderInterface) => {
        return new RefreshTokenManager<RefreshTokenInterface>(refreshTokenService, tokenEncoder, 100);
      },
      deps: [REFRESH_TOKEN_SERVICE, TOKEN_ENCODER]
    }
  ]
};
```
From now on refresh token will be handled by `REFRESH_TOKEN_SERVICE`.

## License

Licensed under the [MIT license](../../LICENSE).
