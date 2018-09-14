# RxStack Framework

[![Maintainability](https://api.codeclimate.com/v1/badges/9bb1b2d02b93df616908/maintainability)](https://codeclimate.com/github/rxstack/rxstack/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9bb1b2d02b93df616908/test_coverage)](https://codeclimate.com/github/rxstack/rxstack/test_coverage)
[![Build Status](https://travis-ci.org/rxstack/rxstack.svg?branch=master)](https://travis-ci.org/rxstack/rxstack)

> RxStack is a realtime object-oriented framework which helps you build a micro service web applications
on top of other frameworks like `express` and `socketio` by adding an abstraction layer.


![lifecycle](assets/lifecycle.jpg)  

## Getting started

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project folder and file structure](#project-structure)
- [NPM Scripts](#npm-scripts)
- [Controllers](#controllers)
    - [Creating a Controller](#controllers-create)
    - [Mapping a URL and socket event to a Controller](#controllers-mapping)
    - [Managing errors](controllers-errors)
    - [The Request and Response Object](controllers-request-response)
    - [File upload](controllers-file-upload)
- [Event Listeners](#event-listeners)
- [Console](#console)
- [Security](#security)
    - [Installation](#security-installation)
    - [Configurations](#security-configuration)
    - [Registering a user provider](#security-user-provider)
    - [Securing a controller](#security-controller)
    - [Obtaining the token](#security-obtaining-token)
    - [Securing controller with authentication listener](#security-listener)
    - [References](https://github.com/rxstack/rxstack/tree/master/packages/security)
- [Servers](#servers)
- [Channels](#channels)
    - [Installation](#channel-manager-installation)
    - [Adding and removing users from a channel](#channel-manager-adding-removing)
    - [Usage server side](#channel-manager-usage-server-side)
    - [Usage client side](#channel-manager-usage-client-side)
    - [References](https://github.com/rxstack/rxstack/tree/master/packages/channels)
- [Databases](#databases)
    - [TypeORM](#databases)
    - [Mongoose](#databases)
- [Testing](#testing)
    - [Unit]()
    - [Integration]()
    - [Functional]()
- [References]()
    - [Async Event Dispatcher](https://github.com/rxstack/rxstack/tree/master/packages/async-event-dispatcher)
    - [Channels](https://github.com/rxstack/rxstack/tree/master/packages/channels)
    - [Exceptions](https://github.com/rxstack/rxstack/tree/master/packages/exceptions)
    - [Query Filter](https://github.com/rxstack/rxstack/tree/master/packages/query-filter)
    - [Service Registry](https://github.com/rxstack/rxstack/tree/master/packages/service-registry)
    - [Configuration](https://github.com/rxstack/rxstack/tree/master/packages/configuration)
    - [Core](https://github.com/rxstack/rxstack/tree/master/packages/core)
    - [Express Server](https://github.com/rxstack/rxstack/tree/master/packages/express-server)
    - [Express File Upload](https://github.com/rxstack/rxstack/tree/master/packages/express-file-upload)
    - [SocketIO Server](https://github.com/rxstack/rxstack/tree/master/packages/socketio-server)
    - [Security](https://github.com/rxstack/rxstack/tree/master/packages/security)
    - [Utils](https://github.com/rxstack/rxstack/tree/master/packages/utils)
    

## <a name="prerequisites"></a> Prerequisites
`RxStack` requires `Node v8.0.0` and later. On MacOS and other Unix systems the 
[Node Version Manager](https://github.com/creationix/nvm) is a good way 
to quickly install the latest version of NodeJS and keep up it up to date. You'll also need git installed.
After successful installation, the node, npm and git commands should be available on the terminal 
and show something similar when running the following commands:

```bash
$ node --version
v8.5.0
```

```bash
$ npm --version
6.1.0
```

```bash
$ git --version
git version 2.7.4
```

## <a name="installation"></a> Installation

Let's clone the pre-configured skeleton application:

```bash
$ git clone https://github.com/rxstack/skeleton.git my-project
$ cd my-project
$ npm install
$ npm run dev
```

If you now try to access [localhost](http://localhost:3000/) in the browser you should see the welcome page 
or you can access it via websockets:

```typescript
const io = require('socket.io-client');
const conn = io('ws://localhost:4000', {transports: ['websocket']});

conn.emit('app_index', null, function (response: any) {
  console.log(response); // should output Response object
});
```

## <a name="project-structure"></a> Project folder and file structure

- `src` - all your code lives here
    - `index.ts` - application entry file
    - `app` - application related files
        - `APPLICATION_OPTIONS.ts` - all application configurations [read more](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/application.md).
        - `commands` - command line application files [read more](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/console.md).
        - `controllers` - all your controller files [read more](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md).
        - `event-listeners` - all your event listener files [read more](https://github.com/rxstack/rxstack/blob/master/packages/async-event-dispatcher).
    - `environments` - configuration files [read more](https://github.com/rxstack/rxstack/tree/master/packages/configuration).
- `test` - all tests files
- `static` - all static files
- `tslint.json` - typescript linter configuration
- `tsconfig.json` - typescript configuration

## <a name="npm-scripts"></a> NPM scripts

- `$ npm run dev` - starts the application in development environment with `nodemon` and watches the file changes
- `$ npm run compile` - compiles the source code
- `$ npm run watch` - watching for file changes
- `$ npm run clean` - removes the `dist` directory
- `$ npm run lint` - lints the source code using `tslint.json`
- `$ npm run mocha` - runs tests using `mocha.opts`
- `$ npm run coverage` - runs tests with `nyc`
- `$ npm test` - runs lint, mocha and coverage
- `$ npm run cli` - runs command line applications (you need to compile it first)
- `$ npm run prod` - starts the application in production environment (you need to compile it first)
    
      
## <a name="controllers"></a> Controllers
A controller is a typescript function you create that reads information from the `Request` object 
and creates and returns a `Response` object. The response could be an HTML page, JSON, XML, a file download, 
a 404 error or anything else you can dream up. 
The controller executes whatever arbitrary logic your application needs to send a response to the client.
 
### <a name="controllers-create"></a> Creating a controller 
A controller is usually a method inside a controller class:

```typescript
// my-project/src/app/controllers/lucky.controller.ts

import {Injectable} from 'injection-js';
import {Http, Logger, Request, Response, WebSocket} from '@rxstack/core';

@Injectable()
export class LuckyController {

  // Logger is injected via constructor method
  constructor(private logger: Logger) { }

  @Http('GET', '/lucky/number/:max', 'app_lucky_number')
  @WebSocket('app_lucky_number')
  async number(request: Request): Promise<Response> {
    this.logger.debug('Debugging request params: ', request.params.toObject());
    const num: number = Math.floor(Math.random() * Math.floor(request.params.get('max')));
    return new Response({num});
  }
}
```

This controller is pretty straightforward:

- a `LuckyController` class is created and [@Injectable()](https://github.com/mgechev/injection-js) annotation is applied.
- The `number()` method is created and 
[`@http()` and `@websocket()`](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#decorators) 
annotations are applied 
in order to register it in the `Kernel`.
- A [`Request`](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#request-object) object is passed as a method argument.
- A promise of [`Response`](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#response-object) object is returned.

> you need to register `LuckyController` in the controller providers:

```typescript
// my-project/src/app/controllers/APP_CONTROLLER_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {LuckyController} from './lucky-controller';

export const APP_CONTROLLER_PROVIDERS: ProviderDefinition[] = [
  { provide: LuckyController, useClass: LuckyController }
];
```

### <a name="controllers-mapping"></a> Mapping a URL and socket event to a Controller

In order to view the result of this controller, you need to map a URL to it via a `@http()` decorator.

```typescript
@Http('GET', '/lucky/number/:max', 'app_lucky_number')
```

then you can access it via http:
            
```bash
curl http://localhost:3000/lucky/number/10
```

and setting an event name via a `@websocket()` decorator.

```typescript
@WebSocket('app_lucky_number')
```

then you can access it using socketio-client:

```typescript
const io = require('socket.io-client');
const conn = io('ws://localhost:4000', {transports: ['websocket']});

conn.emit('app_lucky_number', {params: {max: 10}}, function (response: any) {
  console.log(response); // should output Response object
});
```

### <a name="controllers-errors"></a> Managing errors

If you throw an exception that extends or is an instance of [`HttpException`](https://github.com/rxstack/rxstack/blob/master/packages/exceptions/src/http.exception.ts), 
`RxStack` will use the appropriate HTTP status code. 
Otherwise, the response will have a 500 HTTP status code:

```typescript
// my-project/src/app/controllers/lucky.controller.ts

import {Injectable} from 'injection-js';
import {Http, Logger, Request, Response, WebSocket} from '@rxstack/core';
import {BadRequestException} from '@rxstack/exceptions';

@Injectable()
export class LuckyController {
  // ...
  async number(request: Request): Promise<Response> {
    if (parseInt(request.params.get('max')) < 3) {
      throw new BadRequestException('Number should be greater than 3.');
    }
    // ...
  }
}
```

### Learn more:

- [Application](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/application.md)
- [Kernel](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md)
- [Exceptions](https://github.com/rxstack/rxstack/tree/master/packages/exceptions)

### <a name="controllers-request-response"></a> The Request and Response Object

The `Request` object is created from the underlying framework incoming request. It lives only in the controller method.
It has several public properties that return all information you need about the request.

Learn more about [Request Object](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#request-object).

The `Response` object passes information to the underlying framework to construct the response and send it to the client.

Learn more about [Response Object](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#response-object).

### <a name="controllers-file-upload"></a> File upload

> Uploading files is supported only over http (at the moment) with
[express server module](https://github.com/rxstack/rxstack/tree/master/packages/express-server).

`RxStack` comes with [ExpressFileUpload Module](https://github.com/rxstack/rxstack/tree/master/packages/express-file-upload)

## <a name="event-listeners"></a> Events and Event Listeners
During the execution of a `RxStack` application, some event notifications are triggered. 
Your application can listen to these notifications and respond to them by executing any piece of code.

`RxStack` triggers several events related to the kernel while processing the Request. 
Third-party modules may also dispatch events, and you can even dispatch custom events from your own code.

### <a name="creating-listener"></a> Creating an event listener
The most common way to listen to an event is to register an event listener:

```typescript
// my-project/src/app/event-listeners/exception.listener.ts
import {Injectable} from 'injection-js';
import {ExceptionEvent, KernelEvents, Response} from '@rxstack/core';
import {HttpException} from '@rxstack/exceptions';
import {Observe} from '@rxstack/async-event-dispatcher';

@Injectable()
export class ExceptionListener {

  @Observe(KernelEvents.KERNEL_EXCEPTION)
  async onException(event: ExceptionEvent): Promise<void> {
    // make sure it is applied only on LuckyController.number
    if (event.getRequest().routeName !== 'app_lucky_number') {
      return;
    }
    // You get the exception object from the received event
    const exception = event.getException();
    const errMsg = `My error says: ${exception.message}`;

    // Customize your response object to display the exception details
    const response = new Response(errMsg);

    if (exception instanceof HttpException) {
      response.statusCode = exception.statusCode;
    } else {
      response.statusCode = 500;
    }

    // sends the modified response object to the event
    event.setResponse(response);
  }
}
```

> you need to register `ExceptionListener` in the application providers:

```typescript
// my-project/src/app/event-listeners/APP_EVENT_LISTENERS_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {ExceptionListener} from './exception.listener';

export const APP_LISTENERS_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: ExceptionListener, useClass: ExceptionListener }
];
```


### Learn more:

- [Async Event Dispatcher](https://github.com/rxstack/rxstack/tree/master/packages/async-event-dispatcher)
- [Application Events](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/application.md#bootstrap-event)
- [Kernel Events](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/kernel.md#events)
- [Server Events](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/server.md#server-events)

## <a name="console"></a> Console
Your console commands can be used for any recurring task, such as cronjobs, imports, or other batch jobs.

To see the build-in command you can run:

```
    $ npm run cli
```

- `$ npm run cli debug:http-metadata` - Prints http metadata for an application
- `$ npm run cli debug:web-socket-metadata` - Prints web socket metadata for an application.


[Learn More](https://github.com/rxstack/rxstack/blob/master/packages/core/docs/console.md)


## <a name="security"></a> Security
In this article you'll learn how to set up your application's security step-by-step, from configuring your application 
and how you load users, to denying access and fetching the `User` object.

### <a name="security-installation"></a> Installation

```bash
npm install @rxstack/security --save
```

### <a name="security-configuration"></a> Configurations

Add the following configurations to the environment file:

```typescript
// my-project/src/environments/environment.ts

// ...
  security: {
    local_authentication: true,
    token_extractors: {
      authorization_header: {
        enabled: true
      }
    },
    ttl: 300,
    secret: 'my_secret',
    signature_algorithm: 'HS512'
  }
```

and register the module:

```typescript
// my-project/src/app/APP_OPTIONS.ts
// ...

import {ApplicationOptions} from '@rxstack/core';
import {environment} from '../environments/environment';
import {SecurityModule} from '@rxstack/security';

export const APP_OPTIONS: ApplicationOptions = {
  // ...
  imports: [
    // ...
    SecurityModule.configure(environment.security)
  ]
};
```

[Learn more about security configurations](https://github.com/rxstack/rxstack/tree/master/packages/security#configurations)


### <a name="security-user-provider"></a> Registering a user provider
The easiest (but most limited) way, is to configure `RxStack` to load hardcoded users directly from configurations. 
This is called an "in memory" provider, but it's better to think of it as an "in configuration" provider:

- Let's create the `User` model:

```typescript
// my-project/src/app/models/user.ts
import {EncoderAwareInterface, PlainTextPasswordEncoder, User as BaseUser} from '@rxstack/security';

export class User extends BaseUser implements EncoderAwareInterface {
  getEncoderName(): string {
    return PlainTextPasswordEncoder.ENCODER_NAME;
  }
}
```

We extend `User` from `@rxstack/security` and tell the model to use a specific password encoder.

[Lear more about password encoders](https://github.com/rxstack/rxstack/tree/master/packages/security#password-encoders)

- Let's add users to `environment.ts` file:

```typescript
// my-project/src/environments/environment.ts

// ...
  users: [
    {
      username: 'admin',
      password: 'admin',
      roles: ['ROLE_ADMIN']
    },
    {
      username: 'user',
      password: 'user',
      roles: ['ROLE_USER']
    }
  ]
```

> We added two users with different roles `ROLE_ADMIN` and `ROLE_USER`.

- Let's register the in-memory user provider in the application providers:


```typescript
// my_project/src/app/security/APP_SECURITY_PROVIDERS.ts 

import {ProviderDefinition, UserInterface} from '@rxstack/core';
import {InMemoryUserProvider, USER_PROVIDER_REGISTRY} from '@rxstack/security';
import {environment} from '../../environments/environment';
import {User} from '../models/user';

export const APP_SECURITY_PROVIDERS: ProviderDefinition[] = [
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: () => {
      return new InMemoryUserProvider<UserInterface>(
        environment.users,
        (data: UserInterface) => new User(data.username, data.password, data.roles)
      );
    },
    deps: [],
    multi: true
  },
];
```

register the security providers in the application options:

```typescript
// my-project/src/app/APP_OPTIONS.ts
// ...

import {ApplicationOptions} from '@rxstack/core';
import {APP_SECURITY_PROVIDERS} from './security/providers';

export const APP_OPTIONS: ApplicationOptions = {
  // ...
  providers: [
    // ...
    ...APP_SECURITY_PROVIDERS
  ]
};
```

[Learn more about user providers](https://github.com/rxstack/rxstack/tree/master/packages/security#user-providers)

###<a name="security-controller"></a> Securing a controller
As we successfully set up and configured security module, let's create our first secured controller:

```typescript
// my-project/src/app/controllers/secured.controller.ts
import {Injectable} from 'injection-js';
import {Http, Request, Response, WebSocket} from '@rxstack/core';
import {ForbiddenException} from '@rxstack/exceptions';

@Injectable()
export class SecuredController {

  @Http('GET', '/secured/admin', 'app_secured_admin')
  @WebSocket('app_secured_admin')
  async adminAction(request: Request): Promise<Response> {
    if (!request.token.hasRole('ROLE_ADMIN')) {
      throw new ForbiddenException();
    }
    return new Response('secured admin action');
  }
}
```

> you need to register `SecuredController` in the application controller providers:

```typescript
// my-project/src/app/controllers/APP_CONTROLLER_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {SecuredController} from './secured.controller';

export const APP_CONTROLLER_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: SecuredController, useClass: SecuredController }
];
```

As you see in the `Request` object we retrieve the security token and check if the logged in user has a certain role.

[Learn more about tokens](https://github.com/rxstack/rxstack/tree/master/packages/security#working-with-token)

### <a name="security-obtaining-token"></a> Obtaining the token
By default `@rxstack/security` is using JWT. The token could be generated on a dedicated authentication server 
or in the `RxStack` application if `local_authentication` is enabled.

Let's obtain the token:

```bash
curl -X POST \
  http://localhost:3000/security/login \
  -H 'content-type: application/json' \
  -d '{
	"username": "admin",
	"password": "admin"
}'
```

or via websockets:


```typescript
const io = require('socket.io-client');
const conn = io('ws://localhost:4000', {transports: ['websocket']});

conn.emit('security_login', {params: {username: 'admin', password: 'admin'}}, function (response: any) {
  console.log(response.content); // should output {"token": "...", "refreshToken": "..."}
});
```

> Token expiration time is set in the `ttl` option in the security module.


As we now have the token we can try to access `app_secured_admin` via http:

```bash
curl -X GET \
  http://localhost:3000/secured/admin \
  -H 'authorization: Bearer your-generated-token' 
```

To access secured controller actions via websocket, you first need to authenticate:

```typescript
// ...

conn.emit('security_authenticate', {params: {bearer: 'your-generated-token'}}, function (response: any) {
  console.log(response.statusCode); // should output 204 or 401
  
  // now you can access the secured action
  conn.emit('app_secured_admin', null, function (response: any) {
    console.log(response.statusCode); // should output 200
  });
});
```

[Learn more about local authentication](https://github.com/rxstack/rxstack/tree/master/packages/security#local-authentication)

### <a name="security-listener"></a> Securing with authentication listener
If you need to restrict the access on application level then you need to create an authentication listener.

Let's add another action to the `SecuredController`:

```typescript
// my-project/src/app/controllers/secured.controller.ts
import {Injectable} from 'injection-js';
import {Http, Request, Response, WebSocket} from '@rxstack/core';
import {ForbiddenException} from '@rxstack/exceptions';

@Injectable()
export class SecuredController {
  // ...
  
  @Http('GET', '/secured/user', 'app_secured_user')
  @WebSocket('app_secured_user')
  async userAction(request: Request): Promise<Response> {
    return new Response('secured user action');
  }
}
```

As you see the `userAction` is not secured. Let's create the listener:

```typescript
// my-project/src/app/listeners/authentication.listener.ts
import {Injectable} from 'injection-js';
import {KernelEvents, RequestEvent} from '@rxstack/core';
import {ForbiddenException} from '@rxstack/exceptions';
import {Observe} from '@rxstack/async-event-dispatcher';

@Injectable()
export class AuthenticationListener {

  @Observe(KernelEvents.KERNEL_REQUEST)
  async onRequest(event: RequestEvent): Promise<void> {
    // make sure route/event name starts with "app_secured_"
    if (event.getRequest().routeName.search('^app_secured_') === -1) {
      return;
    }
    // checks whether user is authenticated or not
    if (!event.getRequest().token.isAuthenticated()) {
      throw new ForbiddenException();
    }
  }
}
```

> you need to register `AuthenticationListener` in the application listener providers:

```typescript
// my-project/src/app/listener/APP_EVENT_LISTENERS_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {AuthenticationListener} from './authentication.listener';

export const APP_EVENT_LISTENERS_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: AuthenticationListener, useClass: AuthenticationListener },
];
```

and now let's try it:

```bash
curl -X GET \
  http://localhost:3000/secured/user \
  -H 'authorization: Bearer your-generated-token' 
```

As you see `RxStack` security module provides powerful and flexible authentication system.

[Complete security module documentations](https://github.com/rxstack/rxstack/tree/master/packages/security)

## <a name="servers"></a> Servers
The whole point of `RxStack` is staying as a platform-agnostic. A framework's architecture is focused on being applicable 
to any kind of server-side solution. Build once, use everywhere!

There are two build-in server modules:

- [ExpressServerModule](https://github.com/rxstack/rxstack/tree/master/packages/express-server)
- [SocketioServerModule](https://github.com/rxstack/rxstack/tree/master/packages/socketio-server)

## <a name="channel-manager"></a> Channel Manager
`ChannelManager` allows you to add connected users to a channel. 
You'll be able to notify specific group of users of certain events.

### <a name="channel-manager-installation"></a> Installation

```bash
npm install @rxstack/channels --save
```

and now let's register it in the application common providers:

```typescript
// my-project/src/app/APP_COMMON_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {ChannelManager} from '@rxstack/channels';

export const APP_COMMON_PROVIDERS: ProviderDefinition[] = [
  // ...
  { provide: ChannelManager, useClass: ChannelManager }
];
```

### <a name="channel-manager-adding-removing"></a> Adding and removing users from a channel
To add an authenticated user to a channel we need to observe to `AuthenticationEvents.SOCKET_AUTHENTICATION_SUCCESS` event,
and on `ServerEvents.DISCONNECTED` event we need to remove the user from the channel.

> Note: works only with socket servers

Let's create the listener:

```typescript
// my-project/src/app/event-listeners/channel-manager.listener.ts
import {Injectable} from 'injection-js';
import {ServerEvents, ConnectionEvent} from '@rxstack/core';
import {Observe} from '@rxstack/async-event-dispatcher';
import {AuthenticationEvents, AuthenticationRequestEvent} from '@rxstack/security';
import {ChannelManager} from '@rxstack/channels';

@Injectable()
export class ChannelManagerListener {

  constructor(private channelManager: ChannelManager) { }

  @Observe(AuthenticationEvents.SOCKET_AUTHENTICATION_SUCCESS)
  async onSocketAuthenticationSuccess(event: AuthenticationRequestEvent): Promise<void> {
    // any time user is authenticated via websocket connection then he will be added to the "general" channel.
    this.channelManager.channel('general').join(event.request.connection);
  }

  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: ConnectionEvent): Promise<void> {
    // if user exists in the "general" channel then on disconnect he will be removed from it
    this.channelManager.channel('general').leave(event.connection);
  }
}
```

> Do not forget to register the listener in the application event listener providers.

All authenticated users are added/removed from the `general` channel. 

### <a name="channel-manager-usage-server-side"></a> Usage server side
Let's create a controller action:

```typescript
// my-project/src/app/controllers/hello.controller.ts
import {Injectable, Injector} from 'injection-js';
import {Http, InjectorAwareInterface, Request, Response, WebSocket} from '@rxstack/core';
import {ChannelManager} from '@rxstack/channels';
import {ForbiddenException} from '@rxstack/exceptions';

@Injectable()
export class HelloController implements InjectorAwareInterface {

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @WebSocket('app_say_hello')
  async sayHelloAction(request: Request): Promise<Response> {
    if (!request.token.isAuthenticated()) {
      throw new ForbiddenException();
    }
    const channelManager = this.injector.get(ChannelManager);
    const channel = channelManager.channel('general');
    channel.send('say_hello', {'message': 'Hello there'}, (conn) => conn !== request.connection);
    return new Response({'number_of_connected_users': channel.length});
  }
}
```

The `sayHelloAction` will send a message to all users in that channel except for the current user.

> Notice: we implemented `InjectorAwareInterface` in order to get `ChannelManager` from the `Injector`

> Do not forget to register `HelloController` in the application controller providers


### <a name="channel-manager-usage-client-side"></a> Usage client side

Let's `say hello`:

```typescript
conn.emit('app_say_hello', null, function (response: any) {
  console.log(response); // should output: {"number_of_connected_users": 2}
});
```

Let's subscribe to the `say_hello` event:

```typescript
conn.on('say_hello', function (data: any) {
  console.log(data); // should output: Hello there
});
```

> Notice: all connected users should be authenticated!

[Learn more about channels](https://github.com/rxstack/rxstack/tree/master/packages/channels)

## <a name="databases"></a> Databases

`RxStack` doesn't provide a module to work with the database, but you can add any of your choice.
Below you find some database examples:


### <a name="databases-typeorm"></a> TypeOrm
TypeORM is Object Relational Mapper

[Please read the documentations](http://typeorm.io)

> We assume that mysql is installed and running on your machine.

Let's install dependencies: 

```bash
$ npm install --save typeorm mysql
```

Next step is to add the configurations:

```typescript
// my-project/src/environments/environment.ts

import {configuration} from '@rxstack/configuration';

// ...
  typeorm: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'demo',
    entities: [
      configuration.getRootPath() + '/dist/app/entities/*.js'
    ],
    synchronize: true // set it to false in production
  }
```

now we can create the typeorm connection provider:

```typescript
// my-project/src/app/APP_COMMON_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {Provider} from 'injection-js';
import {environment} from '../environments/environment';
import {createConnection, Connection as TypeormConnection} from 'typeorm';
import {MysqlConnectionOptions} from 'typeorm/driver/mysql/MysqlConnectionOptions';

const typeormProvider =  async function(): Promise<Provider> {
  const connection: TypeormConnection = await createConnection(<MysqlConnectionOptions>environment.typeorm);
  return { provide: TypeormConnection, useValue: connection};
};

export const APP_COMMON_PROVIDERS: ProviderDefinition[] = [
  // ...
  typeormProvider()
];
```

> Pay attention how we register async providers

Let's create the entity:

```typescript
// my-project/src/app/entities/cat.ts

import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;
}
```

Let's create the service class:

```typescript
// my-project/src/app/services/cat.service.ts

import {Injectable} from 'injection-js';
import {Cat} from '../entities/cat';
import {Repository} from 'typeorm';

@Injectable()
export class CatService {

  constructor(protected repo: Repository<Cat>) { }

  async create(data: any): Promise<Cat> {
    const createdCat = await this.repo.merge(this.repo.create(), data);
    return await this.repo.save(createdCat);
  }

  async findAll(): Promise<Cat[]> {
    return await this.repo.find();
  }
}
```

we need to register the service in the service providers:

```typescript

// my-project/src/app/services/APP_SERVICE_PROVIDERS.ts

import {ProviderDefinition} from '@rxstack/core';
import {CatService} from './cat.service';
import {Connection as TypeormConnection} from 'typeorm';
import {Cat} from '../entities/cat';

export const APP_SERVICE_PROVIDERS: ProviderDefinition[] = [
  {
    provide: CatService,
    useFactory: (connection: TypeormConnection) => {
      return new CatService(connection.getRepository(Cat));
    },
    deps: [TypeormConnection]
  },
];
```

> `APP_SERVICE_PROVIDERS` needs to be registered in the application providers

That's it, we can get the service from anywhere:

```typescript
// ...

const service = this.injector.get(CatService);
const result = await service.create({
  'name': 'amanda', 'age': 5, 'breed': 'Birman'
});
```

### <a name="databases-mongoose"></a> Mongoose
Mongoose provides a straight-forward, schema-based solution to model your application data. 
It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

[Please read the documentations](http://mongoosejs.com/)

> We assume that mongodb is installed and running on your machine.

Let's install dependencies: 

```bash
$ npm install --save mongodb mongoose @types/mongoose
```

Next step is to add the configurations:

```typescript
// my-project/src/environments/environment.ts

// ...
  mongoose: {
    uri: 'mongodb://localhost:27017/test',
    options: {
      useNewUrlParser: true
    }
  }
```

now we can create the mongoose connection provider:

```typescript
// my-project/src/app/APP_COMMON_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {Connection as MongooseConnection} from 'mongoose';
import mongoose = require('mongoose');
import {Provider} from 'injection-js';
import {environment} from '../environments/environment';
mongoose.Promise = global.Promise;

const mongooseProvider =  async function(): Promise<Provider> {
  const connection: MongooseConnection = mongoose.createConnection(environment.mongoose.uri, environment.mongoose.options);
  return { provide: MongooseConnection, useValue: connection};
};

export const APP_COMMON_PROVIDERS: ProviderDefinition[] = [
  // ...
  mongooseProvider()
];
```

> Pay attention how we register async providers

Let's create the model:

```typescript
// my-project/src/app/models/cat.interface.ts

export interface CatInterface {
  name: string;
  age: number;
  breed: string;
}
```

and the schema:


```typescript
// my-project/src/app/schemas/cat.schema.ts

import * as mongoose from 'mongoose';

export const CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});
```

Let's create the service class:

```typescript
// my-project/src/app/services/cat-mongoose.service.ts

import {Injectable} from 'injection-js';
import {Model} from 'mongoose';
import {CatInterface} from '../models/cat.interface';

@Injectable()
export class CatMongooseService {

  constructor(protected model: Model<any>) { }

  async create(data: any): Promise<CatInterface> {
      const result = await this.model.create(data);
      return result.toObject ? result.toObject() : result;
  }

  async findAll(): Promise<CatInterface[]> {
    return await this.model.find().lean(true).exec();
  }
}
```

we need to register the service in the service providers:

```typescript

// my-project/src/app/services/APP_SERVICE_PROVIDERS.ts

import {ProviderDefinition} from '@rxstack/core';
import {CatMongooseService} from './cat-mongoose.service';
import {Connection as MongooseConnection} from 'mongoose';
import {CatSchema} from '../schemas/cat.schema';

export const APP_SERVICE_PROVIDERS: ProviderDefinition[] = [
  {
    provide: CatMongooseService,
    useFactory: (connection: MongooseConnection) => {
      return new CatMongooseService(connection.model('Cat', CatSchema, 'cats'));
    },
    deps: [MongooseConnection]
  },
];
```

> `APP_SERVICE_PROVIDERS` needs to be registered in the application providers

That's it, we can get the service from anywhere:

```typescript
// ...

const service = this.injector.get(CatMongooseService);
const result = await service.create({
  'name': 'amanda', 'age': 5, 'breed': 'Birman'
});
```

As you see you can integrate any database framework.

## <a name="testing"></a> Testing
Automated tests are an essential part of the fully functional software product. That is very critical to cover at least 
the most sensitive parts of your system. In order to achieve that goal, we produce a set of different tests 
like integration tests, unit tests, functional tests, and so on.

> `RxStack` uses  [mocha](https://mochajs.org/#getting-started), [chai](http://www.chaijs.com/) 
and [sinon](https://sinonjs.org/) testing frameworks. 


##### <a name="testing-unit"></a> Unit Tests

Services are often the easiest files to unit test. Let's create a `ValueService` :

```typescript
// my-project/src/app/services/value.service.ts

export class ValueService {
  getValue(): string {
    return 'real value';
  }
}
```

and test it:

```typescript
// my-project/test/unit/services/value.service.spec.ts

import {ValueService} from '../../../src/app/services/value.service';

describe('Unit:ValueService', () => {
  it('#getValue should return real value', async () => {
    const valueService = new ValueService();
    valueService.getValue().should.equal('real value');
  });
});
```

Services often depend on other services, but injecting the real service rarely works well as most dependent 
services are difficult to create and control.
Instead you can mock the dependency, use a dummy value, or create a spy on the pertinent service method.

Let's create a `MasterService` which depends on `ValueService`:

```typescript
// my-project/src/app/services/value.service.ts

import {ValueService} from './value.service';

export class MasterService {

  constructor(private valueService: ValueService) { }

  getValue(): string {
    return this.valueService.getValue();
  }
}
```

and test it:

```typescript
// my-project/test/unit/services/master.service.spec.ts

import {MasterService} from '../../../src/app/services/master.service';
import {ValueService} from '../../../src/app/services/value.service';

const sinon = require('sinon');

describe('Unit:MasterService', () => {

  it('#getValue should return fake value', async () => {
    const valueService = sinon.createStubInstance(ValueService);
    valueService.getValue.returns('fake value');
    const masterService = new MasterService(valueService);
    masterService.getValue().should.equal('fake value');
  });
});
```

These standard testing techniques are great for unit testing services in isolation.

### <a name="testing-integration"></a> Integration Tests

Integration tests determine if independently developed units of software work correctly when they are connected to each other. 
To test these services we need to bootstrap the application and pull them from the `Injector` and 
if needed we can replace services with stubs.

Let's make our `MasterService` and `ValueService` services injectable:

```typescript
import {Injectable} from 'injection-js';

@Injectable()
export class MasterService {
  // ...
}

@Injectable()
export class ValueService {
  // ...
}
```

and now we need to register them in service providers:

```typescript
// my-project/src/app/services/APP_SERVICE_PROVIDERS.ts
import {ProviderDefinition} from '@rxstack/core';
import {MasterService} from './master.service';
import {ValueService} from './value.service';

export const APP_SERVICE_PROVIDERS: ProviderDefinition[] = [
  // ...
  {
    provide: MasterService,
    useClass: MasterService
  },
  {
    provide: ValueService,
    useClass: ValueService
  }
];
```

and now let's test it:

```typescript
//  my-project/test/integration/services/master.service.spec.ts

import 'reflect-metadata';
import {configuration} from '@rxstack/configuration';
configuration.initialize(configuration.getRootPath() + '/src/environments');
import {MasterService} from '../../../src/app/services/master.service';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {APP_OPTIONS} from '../../../src/app/APP_OPTIONS';

describe('Integration:MasterService', () => {

  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;
  let masterService: MasterService;

  before(async () => {
    await app.start();
    injector = app.getInjector();
    masterService = injector.get(MasterService);
  });

  after(async () => {
    await app.stop();
  });

  it('#getValue should return real value', async () => {
    masterService.getValue().should.equal('real value');
  });
});
```

sometimes you need to replace the real service with the mock one:

```typescript
//  my-project/test/integration/services/master.service.spec.ts
import 'reflect-metadata';
import {configuration} from '@rxstack/configuration';
configuration.initialize(configuration.getRootPath() + '/src/environments');

import {MasterService} from '../../../src/app/services/master.service';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {ValueService} from '../../../src/app/services/value.service';
import * as _ from 'lodash';
import {APP_OPTIONS} from '../../../src/app/APP_OPTIONS';

const sinon = require('sinon');

describe('Integration:MasterService', () => {

  // Setup application
  const opt = _.cloneDeep(APP_OPTIONS); // clone it otherwise it will affect other tests
  const valueService = sinon.createStubInstance(ValueService);
  valueService.getValue.returns('fake value');

  // replace the real service
  opt.providers.push({
    provide: ValueService,
    useValue: valueService
  });

  const app = new Application(opt);
  let injector: Injector;
  let masterService: MasterService;

  before(async () => {
    await app.start();
    injector = app.getInjector();
    masterService = injector.get(MasterService);
  });

  after(async () => {
    await app.stop();
  });

  it('#getValue should return fake value', async () => {
    masterService.getValue().should.equal('fake value');
  });
});
```

### <a name="testing-functional"></a> Functional Tests 
 
Functional tests let you check a controller action response:

- Make a request (http or socket)
- Test the response
- Rinse and repeat

As an example, a test could look like this using [request-promise](https://github.com/request/request-promise) 
and [socket.io-client](https://github.com/socketio/socket.io-client) :

> You can use you any other http or socket client

```typescript
import 'reflect-metadata';
import {configuration} from '@rxstack/configuration';
configuration.initialize(configuration.getRootPath() + '/src/environments');
import {APP_OPTIONS} from '../../../src/app/APP_OPTIONS';
import {Injector} from 'injection-js';
import {Application, ServerManager} from '@rxstack/core';
import {IncomingMessage} from 'http';

const rp = require('request-promise');
const io = require('socket.io-client');

describe('Functional:Controllers:HelloController', () => {

  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;
  let httpHost: string;
  let wsHost: string;
  let conn: any;

  before(async () => {
    await app.start();
    injector = app.getInjector();
    httpHost = injector.get(ServerManager).getByName('express').getHost();
    wsHost = injector.get(ServerManager).getByName('socketio').getHost();
    conn = io(wsHost, {transports: ['websocket']});
  });

  after(async () => {
    await conn.close();
    await app.stop();
  });

  it('#sayHello over http should return hello', async () => {
    const options = {
      uri: httpHost + '/hello',
      resolveWithFullResponse: true,
      json: false
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        const headers = response.headers;
        headers['x-powered-by'].should.be.equal('Express');
        response['statusCode'].should.be.equal(200);
        response['content'].should.be.equal('hello');
      })
      .catch((err: any) => {
        // make sure test fails
        true.should.be.false;
      })
    ;
  });

  it('#sayHello over socket should return hello', (done: Function) => {
    conn.emit('app_hello', null, function (response: any) {
      response['statusCode'].should.be.equal(200);
      response['content'].should.be.equal('hello');
      done();
    });
  });
});
```

> Tip: you can test the response content against JSON schema

For more examples please check the `test` folder in the `@rxstack/skeleton` application.


## License

Licensed under the [MIT license](LICENSE).