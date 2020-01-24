# RxStack Security Module

> The Security module provides facilities for authenticating user requests using JSON Web Token (JWT)  
but also allows you to implement your own authentication strategies.

## Installation

```
npm install @rxstack/security --save

// peerDependencies
npm install @rxstack/async-event-dispatcher@^0.5 @rxstack/core@^0.6 @rxstack/exceptions@^0.5 @rxstack/service-registry@^0.5 winston@^3.2.1
```

## Documentation

* [Setup](#setup)
* [Configurations](#configurations)
* [Token Extractors](#token-extractors)
    - [HeaderTokenExtractor](#token-extractor-header)
    - [QueryParameterTokenExtractor](#token-extractor-query)
    - [Custom TokenExtractor](#token-extractor-custom)
* [User Providers](#user-providers)
    - [InMemoryUserProvider](#in-memory-user-provider)
    - [PayloadUserProvider](#payload-user-provider)
    - [Custom UserProvider](#custom-user-provider)
* [Password Encoders](#password-encoders)
    - [EncoderFactory](#password-encoders)
    - [Build-in encoders](#build-in-encoders)
    - [Usage](#password-encoders-usage)
    - [Custom encoders](#custom-password-encoder)
* [Authentication](#authentication)
    - [Authentication Provider Manager](#authentication-provider-manager)
    - [Authentication Providers](#authentication-providers)
    - [Custom Authentication Provider](#custom-authentication-provider)
* [Working with tokens](#working-with-token)
* [Local Authentication](#local-authentication)
    - [LoginAction](#login-action)
    - [RefreshTokenAction](#refresh-token-action)
    - [LogoutAction](#logout-action)
    - [AuthenticateAction](#authenticate-action)
    - [UnauthenticateAction](#unauthenticate-action)
    - [Local Authentication Events](#local-authentication-events)
* [Token Manager](#token-manager)
* [Refresh Token Manager](#refresh-token-manager)

### <a name="setup"></a>  Setup
`Security` module needs to be configured and registered in the `application`. Let's create the application:

```typescript
import {Application, ApplicationOptions} from '@rxstack/core';
import { SecurityModule } from '@rxstack/security';

export const SECURITY_APP_OPTIONS: ApplicationOptions = {
  imports: [
    // ...
    SecurityModule.configure({
      local_authentication: true,
      token_extractors: {
        query_parameter: {
          enabled: true,
          name: 'bearer' // query string param name
        },
        authorization_header: {
          enabled: true,
          name: 'authorization', // header name
          prefix: 'Bearer'
        }
      },
      ttl: 300,
      secret: 'my_secret',
      signature_algorithm: 'HS512'
    })
  ],
  servers: [
    // ...
  ], 
  providers: [
    // ...
  ]
};
```

### <a name="configurations"></a> Configurations
The module accepts the following options

- `local_authentication`: allows you to authenticate users with username and password, facility to refresh jwt token,
authenticate via sockets and logout from the application. Defaults to `false`.
- `token_extractors`: extracts the token from `query string` or `header`
    - `query_parameter` - extracts the token from query string parameter
    - `authorization_header` -extracts the token from http header
- `ttl` - token validity in seconds. Defaults to `300`
- `refresh_token_ttl` - the time in seconds token could be refreshed. Default to `(60 * 60 * 24)`
- `secret` - used to encode/decode the token:
    - String type - hard to guess string
    - `Rsa` - object with the following properties:
        - `public_key` - path to public key, used to decode the token
        - `private_key` - path to private key, used to sign the token, needed if local authentication is enabled.
        - `passphrase` - used alongside private key
- `signature_algorithm` - algorithm used in jwt
- `user_identity_field` - name of the property in the decoded payload which is used to look up the user.

For more information, please check [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

### <a name="token-extractors"></a> Token Extractors

Token Extractors are responsible to extract the token from `Request` object. There are two build-in extractors:

##### <a name="token-extractors-header"></a> `HeaderTokenExtractor`

Extracts the token from header, accepts the following configurations:

- `enabled` - whether is enabled or not
- `prefix` - token prefix, defaults to `Bearer`
- `name` - header name, default to `authorization`
    
##### <a name="token-extractors-query"></a>  `QueryParameterTokenExtractor` 

Extracts the token from query string parameter, accepts the following configurations:

- `enabled` - whether is enabled or not
- `name`  parameter name, default to `bearer`

##### <a name="token-extractors-custom"></a> Custom Token Extractor

You can create your own extractor by implementing `TokenExtractorInterface`.

```typescript
@Injectable()
export class MyCustomTokenExtractor implements TokenExtractorInterface {

  static readonly EXTRACTOR_NAME = 'my_custom_extractor';

  constructor(private config: SecurityConfiguration) { }

  extract(request: Request): string {
    // extract the token somehow
  }

  getName(): string {
    return MyCustomTokenExtractor.EXTRACTOR_NAME;
  }
}
```

and you need to register it in the application providers:

```typescript
import {TOKEN_EXTRACTOR_REGISTRY} from '@rxstack/security';
{
  // ...
  providers: [
    { provide: TOKEN_EXTRACTOR_REGISTRY, useClass: MyCustomTokenExtractor, multi: true  }
  ]
}
```

### <a name="user-providers"></a> User Providers
[`UserProviderManager`](./src/user-providers/user-provider-manager.ts)
service is responsible for loading the requested user from a storage. It iterates through all registered `user providers` and return 
the user or throws an `UserNotFoundException`.

```typescript
const user = await injector.get(UserProviderManager).loadUserByUsername('admin');
```

There are several build-in user providers but none of them are enabled by default.

> UserProvider services are registered as `multi providers` using `USER_PROVIDER_REGISTRY`.

##### <a name="in-memory-user-provider"></a> InMemoryUserProvider
`InMemoryUserProvider` allows you to load users from configurations.

```typescript
import { UserInterface } from '@rxstack/core';
import { USER_PROVIDER_REGISTRY, InMemoryUserProvider } from '@rxstack/security';
// ...

providers: [
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: () => {
      return new InMemoryUserProvider<UserInterface>(
        [
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
        ],
        (data: UserInterface) => new UserWithEncoder(data.username, data.password, data.roles)
      );
    },
    deps: [],
    multi: true
  },
]

const user = await injector.get(UserProviderManager).loadUserByUsername('admin');
```

> Provider uses `UserWithEncoder`, you can read more about [encoders here](#password-encoders).

##### <a name="payload-user-provider"></a> PayloadUserProvider
`PayloadUserProvider` allows you to load users from token payload without using any storage.

```typescript
import { UserInterface, User } from '@rxstack/core';
import { USER_PROVIDER_REGISTRY, InMemoryUserProvider } from '@rxstack/security';
// ...

providers: [
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: () => {
      return new PayloadProvider<UserInterface>(
        (data: UserInterface) => new User(data.username, null, data.roles)
      );
    },
    deps: [],
    multi: true
  },
]

const user = await injector.get(UserProviderManager)
                           .get('payload')
                           .loadUserByUsername('admin', {'username': 'admin', 'password': null,'roles': ['ROLE_ADMIN']});
```


##### <a name="custom-user-provider"></a> Custom UserProvider
You can create a custom user provider by implementing `UserProviderInterface`:

```typescript
export class MyCustomUserProvider implements UserProviderInterface {
  constructor(private db: Connection) { }
  
  async loadUserByUsername(username: string, payload?: any): Promise<UserInterface> {
    // load user from anywhere
    const user = await this.db.findOneByUsername(username);
    if (!user) throw new UserNotFoundException(username);
    return user;
  }
  
  // unique provider name
  getName(): string {
    return 'my-custom-provider';
  }
}
```

then register it in the application providers:

```typescript
providers: [
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: (db: Connection) => {
      return new MyCustomUserProvider(db);
    },
    deps: [Connection],
    multi: true
  },
]
```
And we're done.

### <a name="password-encoders"></a> Password Encoders
[`EncoderFactory`](./src/password-encoders/encoder-factory.ts) 
service is responsible to retrieve a registered password encoders by user or encoder name. 

```typescript
    // by user
    const encoder: PasswordEncoderInterface = injector.get(EncoderFactory).getEncoder(user);
    
    // by encoder name
    const encoder: PasswordEncoderInterface = injector.get(EncoderFactory).get('some-encoder');
```

When getting the encoder by user then `BcryptPasswordEncoder` is used by default. 
To change that you need to implement `EncoderAwareInterface` in the user class:

```typescript
import {EncoderAwareInterface, User, PlainTextPasswordEncoder} from '@rxstack/security';

export class UserWithEncoder extends User implements EncoderAwareInterface {
  getEncoderName(): string {
    return PlainTextPasswordEncoder.ENCODER_NAME;
  }
}
```

From now on `UserWithEncoder` will use `PlainTextPasswordEncoder`;

##### <a name="build-in-encoders"></a> Build-in encoders
There are two build-in encodes both enabled by default:

- `BcryptPasswordEncoder`: uses [bcrypt](https://github.com/dcodeIO/bcrypt.js) and it is the default encoder.
- `PlainTextPasswordEncoder`: does not encode anything, it just returns the value as it is. 

##### <a name="password-encoders-usage"></a> Usage
All encoder methods are asynchronous. Let's see how we can use them:

```typescript
    const encoder; // .. get it from somewhere
    
    // encodes the plain password
    const encodedPassword: string = await encoder.encodePassword('my-password');

    // compare encoded password against the plain one
    const isPasswordValid: boolean = await encoder.isPasswordValid(encodedPassword, 'my-password');
```

##### <a name="custom-password-encoder"></a> Custom encoders
You can easily create a custom encoder by implementing `PasswordEncoderInterface`:

```typescript
import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '@rxstack/security';

@Injectable()
export class MyEncoder implements PasswordEncoderInterface {

  static readonly ENCODER_NAME = 'my-encoder';

  async encodePassword(raw: string): Promise<string> {
    const encrypted = '...';
    return encrypted;
  }

  async isPasswordValid(encoded: string, raw: string): Promise<boolean> {
    const decrypted = '...';
    return decrypted === raw;
  }

  getName(): string {
    return MyEncoder.ENCODER_NAME;
  }
}
```

then you need to register it in the application providers:

```typescript
providers: [
  {
    provide: PASSWORD_ENCODER_REGISTRY,
    useClass: MyEncoder,
    multi: true
  },
]
```

That's it. Now you can use your encoder.

### <a name="authentication"></a> Authentication
When a request points to a secured area `TokenExtractorListener` extract the raw token from the current `Request` object 
then `AuthenticationTokenListener` validates the given token, and returns an authenticated token if valid.

##### <a name="authentication-provider-manager"></a> AuthenticationProviderManager
`AuthenticationProviderManager` receives several authentication providers, each supporting a different type of token.

```typescript
const token: TokenInterface = '...';

// returns authenticated token or throws AuthenticationException
await injector.get(AuthenticationProviderManager).authenticate(token);
```

You can get a registered authentication provider by name:

```typescript
const tokenAuthenticationProvider = injector.get(AuthenticationProviderManager)
  .get(TokenAuthenticationProvider.PROVIDER_NAME)
```

`AuthenticationProviderManager` also dispatches two types of events:

- `AuthenticationEvents.AUTHENTICATION_SUCCESS`: dispatched when token is successfully authenticated.
- `AuthenticationEvents.AUTHENTICATION_FAILURE`: dispatched only if exception is instance of `AuthenticationException`

```typescript
import {Observe} from '@rxstack/async-event-dispatcher';
import {AuthenticationEvents, AuthenticationEvent, AuthenticationFailureEvent} from '@rxstack/security';
import {Injectable} from 'injection-js';

@Injectable()
export class AuthListener {

  @Observe(AuthenticationEvents.AUTHENTICATION_SUCCESS)
  async onAuthenticationSuccess(event: AuthenticationEvent): Promise<void> {
    // do something
  }

  @Observe(AuthenticationEvents.AUTHENTICATION_FAILURE)
  async onAuthenticationFailure(event: AuthenticationFailureEvent): Promise<void> {
    // do something
  }
}
```

Make sure you register the listener in the application providers.

##### <a name="authentication-providers"></a> Authentication Providers
Each provider (since it implements AuthenticationProviderInterface) has a method support() by which 
the `AuthenticationProviderManager` can determine if it supports the given token. 
If this is the case, the manager then calls the provider's method authenticate(). 
This method should return an authenticated token or throw an `AuthenticationException` (or any other exception extending it).

There are two authentication providers enabled by default.

- `TokenAuthenticationProvider`: It will attempt to authenticate a user based on a jwt token.

```typescript

// extracted jwt token
const rawToken = '...';

// construct token object
const token = new Token(rawToken);

// get token authentication provider from the manager 
const tokenAuthenticationProvider: AuthenticationProviderInterface = '...';

// authenticate the token or throws exception
const authenticatedToken = await tokenAuthenticationProvider.authenticate(token);
```

- `UserPasswordAuthenticationProvider`: It will attempt to authenticate a user based on username and password.

```typescript

// construct token object
const token = new UsernameAndPasswordToken('admin', 'my-password');

// get user-password authentication provider
const userPasswordAuthenticationProvider: AuthenticationProviderInterface = '...';

// authenticate the token or throws exception
const authenticatedToken = await userPasswordAuthenticationProvider.authenticate(token);
```

##### <a name="custom-authentication-provider"></a> Custom Authentication Provider
Creating a custom authentication system is not an easy task, here are the steps you need to follow:

- The token represents the user authentication data present in the request. 
First, you'll create your token class. This will allow the passing of all relevant information to your authentication provider:

```typescript
import {AbstractToken} from '@rxstack/security';

export class MyCustomToken extends AbstractToken {
  constructor(private apiKey: string) {
    super();
  }

  getUsername(): string {
    return this.user ? this.user.username : null;
  }

  getCredentials(): string {
    return this.apiKey;
  }
}
```

> The `MyCustomToken` class extends `AbstractToken` class, which provides basic token functionality. 
Implement the `TokenInterface` on any class to use as a token.

- The authentication provider will do the verification of the `MyCustomToken`:

```typescript
import {Injectable} from 'injection-js';
import {
  UserProviderManager, AuthenticationProviderInterface, TokenManagerInterface
} from '@rxstack/security';
import {TokenInterface, UserInterface} from '@rxstack/core';


@Injectable()
export class MyCustomAuthenticationProvider implements AuthenticationProviderInterface {

  static readonly PROVIDER_NAME = 'my-custom-provider';

  constructor(private userProvider: UserProviderManager) { }

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    const payload = await this.getPayload(token);
    const user = await this.getUserFromPayload(payload);
    token.setPayload(payload);
    token.setUser(user);
    token.setAuthenticated(true);
    token.setFullyAuthenticated(true);
    return token;
  }

  getName(): string {
    return TokenAuthenticationProvider.PROVIDER_NAME;
  }

  support(token: TokenInterface): boolean {
    return (token instanceof MyCustomToken);
  }

  private async getPayload(token: TokenInterface): Promise<Object> {
    // extract somehow the payload from token
    
    return {
      // some useful information
      username: "moderator"
    }; 
  }

  private async getUserFromPayload(payload: Object): Promise<UserInterface> {
    return this.userProvider.loadUserByUsername(payload['username'], payload);
  }
}

```

Let's register the authentication provider in the application:

```typescript
providers: [
  {
    provide: AUTH_PROVIDER_REGISTRY,
    useFactory: (userProvider: UserProviderManager) => {
      return new MyCustomAuthenticationProvider(userProvider);
    },
    deps: [UserProviderManager],
    multi: true
  },
]
```

Let's see it into action:

```typescript

const myCustomToken = new MyCustomToken('my-api-key-extracted-from-somewhere');
const authenticateToken = await injector.get(AuthenticationProviderManager).authenticate(myCustomToken);
```

> `MyCustomToken` is supported only by `MyCustomAuthenticationProvider`.

As a compete guide you can use the build-in token authentication system:

- [`Token`](./src/models/token.ts): token class
- [`TokenAuthenticationProvider`](./src/authentication/token.authentication-provider.ts): authentication provider that supports `Token` class
- [`TokenExtractorListener`](./src/event-listeners/token-extractor-listener.ts): extracts the raw token and sets `Token` object in the `Request`.
- [`AuthenticationTokenListener`](./src/event-listeners/authentication-token-listener.ts): authenticates the token


### <a name="working-with-token"></a> Working with tokens
Token contains information about user and how he was authenticated. Each token implements `TokenInterface`

> Token is available only in the `Request` object.

```typescript
import {Http, Request, Response, WebSocket} from '@rxstack/core';
import {Injectable} from 'injection-js';
import {UnauthorizedException} from '@rxstack/exceptions';

@Injectable()
export class MyController {

  @Http('GET', '/secured', 'secured')
  @WebSocket('secured')
  async securedAction(request: Request): Promise<Response> {
    // only authenticated users can access it
    if (!request.token.hasRole('ROLE_ADMIN')) {
      throw new UnauthorizedException();
    }
    
    // user is authorized  to access that action
    return new Response();
  }
  
  
  @Http('GET', '/not-secured', 'not_secured')
  @WebSocket('not_secured')
  async notSecuredAction(request: Request): Promise<Response> {
    // only not authenticated users can access it
    if (request.token.isAuthenticated()) {
      throw new UnauthorizedException();
    }
    
    // do something
    return new Response();
  }
}
```

There are different types of tokens. 

- `AnonymousToken`: used for not authenticated users.
- `UsernameAndPasswordToken`: used with local authentication
- `Token`: used with api token


There are few important methods:

- `getUser()` - retrieves the current user or `null`
- `isAuthenticated()` - whether user is authenticated or not
- `isFullyAuthenticated()` - when token expires then it can be refreshed,
after refreshed, user is not fully authenticated any more. It is useful for specific actions like
changing password or payments. In that case you can force the user to re-authenticate again.
- `getRoles()` - retrieves user roles
- `hasRole('ROLE_MODERATOR')` - checks whether user has a specific role
- `getUsername()` - retrieves the username of current user or `null`


### <a name="local-authentication"></a> Local Authentication

If enabled it allows users to authenticate via `HTTP` using `username` and `password`.
Under the hood it uses [`SecurityController`](./src/controllers/security-controller.ts) which has the following actions:

##### <a name="login-action"></a> `SecurityController.loginAction` 

Allows user to generate a token via `HTTP` using `username` and `password`.

Using `CURL`

```bash
curl -X POST \
  http://localhost:3000/security/login \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
	"username": "admin",
	"password": "admin"
}'
```

On success with status code 200:

```javascript
{ 
  token: 'generated-token',
  refreshToken:
   { 
     identifier: 'c16fefba1911e414762bb66372bc4bbc',
     username: 'admin',
     payload: { username: 'admin', roles: [ 'ROLE_ADMIN' ] },
     expiresAt: 1553505705047 
   } 
}

```

> An `AuthenticationEvents.LOGIN_SUCCESS` will be dispatched.

On failure status code 401


##### <a name="refresh-token-action"></a> `SecurityController.refreshTokenAction` 

Allows user to refresh the token via `HTTP`.

Using `CURL`

```bash
curl -X POST \
  http://localhost:3000/security/refresh-token \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
  "refreshToken": "f93fd3853e21712d849cd23631c861a3"
}'
```

On success will return the same response as [`loginAction`](#login-action).

> An `AuthenticationEvents.REFRESH_TOKEN_SUCCESS` will be dispatched.

On failure status code 401 (token is expired) or 404 (token not found)

##### <a name="logout-action"></a> `SecurityController.logoutAction` 

Allows user to invalidate the refresh token

Using `CURL`

```bash
curl -X POST \
  http://localhost:3000/security/logout \
    -H 'accept: application/json' \
  -d '{
  "refreshToken": "f93fd3853e21712d849cd23631c861a3"
}'
```

If `refreshToken` is found then it is disabled and status code 204 is returned, otherwise status code 404

> An `AuthenticationEvents.LOGOUT_SUCCESS` will be dispatched.

##### <a name="authenticate-action"></a> `SecurityController.authenticateAction` 

Allows users to authenticate via `WebSocket`.

Once user is connected to the socket server he can authenticate:

```typescript
const io = require('socket.io-client');
const defaultNs = io('http://localhost:4000');
defaultNs.emit('security_authenticate', {'params': {'bearer': 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9......'}}, function (response: any) {
  // should return status code 204 (on success) or 401 (on failure)
});
```

> An `AuthenticationEvents.SOCKET_AUTHENTICATION_SUCCESS` will be dispatched.

##### <a name="unauthenticate-action"></a> `SecurityController.unauthenticateAction` 

Allows user to unauthenticate via `WebSocket`. It will destroy token in the `Request` object.

```typescript
const io = require('socket.io-client');
const defaultNs = io('http://localhost:4000');
defaultNs.emit('security_unauthenticate', null, function (response: any) {
  // should return status code 204 (on success) or 401 (on failure)
});
```

It should return status code `204` or `403` on failure (id user was not previously authenticated)

> An `AuthenticationEvents.SOCKET_UNAUTHENTICATION_SUCCESS` will be dispatched.

##### <a name="local-authentication-events"></a> Local Authentication Events:
Each `Security` controller action dispatches an event. Here is a event listener example:

```typescript
import {AuthenticationEvents, AuthenticationRequestEvent} from '@rxstack/security';
import {Observe} from '@rxstack/async-event-dispatcher';
import {Injectable} from 'injection-js';

@Injectable()
export class AuthListener {

  @Observe(AuthenticationEvents.LOGIN_SUCCESS)
  async onLogin(event: AuthenticationRequestEvent): Promise<void> {
    // do something
  }

  @Observe(AuthenticationEvents.LOGOUT_SUCCESS)
  async onLogout(event: AuthenticationRequestEvent): Promise<void> {
    // do something
  }
  
  @Observe(AuthenticationEvents.REFRESH_TOKEN_SUCCESS)
  async onRefreshToken(event: AuthenticationRequestEvent): Promise<void> {
    // do something
  }  
  
  @Observe(AuthenticationEvents.SOCKET_AUTHENTICATION_SUCCESS)
  async onSocketAuthentication(event: AuthenticationRequestEvent): Promise<void> {
    // do something
  }  
  
  @Observe(AuthenticationEvents.SOCKET_UNAUTHENTICATION_SUCCESS)
  async onSocketUnAuthentication(event: AuthenticationRequestEvent): Promise<void> {
    // do something
  }
}
```

> Make sure you register the listener in the application providers.

### <a name="token-manager"></a> Token Manager

`TokenEncoder` service is responsible for encoding and decoding the JSON Web Token (JWT). 
Under the hood it uses [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

There are two async methods:

- `encode(rawToken)`- encodes the raw token
- `decode(encodedToken)` - decodes the encoded token

If you want to replace JWT with any other token based authentication then you should create your own token manager 
and replace the current one.

```typescript
import {TokenManagerInterface} from '@rxstack/security';
import {Injectable} from 'injection-js';

@Injectable()
export class MyTokenManager implements TokenManagerInterface {

  async encode(payload: Object): Promise<string> {
    return 'encoded-token';
  }

  async decode(token: string): Promise<Object> {
    return 'decoded-token';
  }
}
```

then you need to register it in the application providers. The new one will replace the old one:

```typescript
import {TOKEN_MANAGER} from '@rxstack/security';

providers: [
  {
      provide: TOKEN_MANAGER,
      useClass: MyTokenManager
  }
]
```

### <a name="refresh-token-manager"></a> Refresh Token Manager

`RefreshTokenManager` is responsible for refreshing and validating the actual token by passing an unique identifier.
By default `InMemoryRefreshTokenManager` is enabled but it has some drawbacks because it stores keys in memory 
of the application instance. You can easily replace it with your own which implement [redis](https://redis.io/) for example.

```typescript
import {AbstractRefreshTokenManager, RefreshTokenInterface} from '@rxstack/security';
import {Injectable} from 'injection-js';

@Injectable()
export class MyRefreshTokenManager extends AbstractRefreshTokenManager {

  async persist(refreshToken: RefreshTokenInterface): Promise<RefreshTokenInterface> {
    // persist token in the storage
  }

  async get(identifier: string): Promise<RefreshTokenInterface> {
    // retrieve the token from the storage
  }

  async clear(): Promise<void> {
    // removes all persisted tokens
  }
}
```

then you need to register it in the application providers. The new one will replace the old one:

```typescript
import {REFRESH_TOKEN_MANAGER} from '@rxstack/security';

providers: [
  {
      provide: REFRESH_TOKEN_MANAGER,
      useClass: MyRefreshTokenManager
  }
]
```

## License

Licensed under the [MIT license](../../LICENSE).