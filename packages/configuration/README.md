# The RxStack Configuration

> The Configuration component allows you to load different configuration files depending on node environment.

## Installation

```
npm install @rxstack/configuration --save
```

## Documentation

The `configuration.initialize()` takes up to two options:

1. Path to environment folder directory: `configuration.initialize(process.env.AP_DIR + '/dist/src/configs')`.

2. Files are named `environment.ts` or `environment.testing.ts`. 
You can change the name `configuration.initialize(path_to_dir, 'config')` then it will become `config.ts`

First you need to create `environment.ts` in the `/src/environments` folder. 
Let’s say we want to load different file in production environment 
then we need to create a new file `/src/environments/environment.production.ts`.
The production environment will inherit all configurations from `environment.ts`. 
Under the hood it uses lodash `_.merge()` to overwrite configurations.

* [Example](#example)
* [Variable types](#variable-types)
* [Root path](#root-path)


### <a name="example"></a>  Example
In `environments/environment.ts` we want to use the local development environment:

```typescript
export const environment = {
  "host": "localhost",
  "port": 3000,
  "mongodb": "mongodb://localhost:27017/myapp",
};
```

In `environments/environment.production.ts` we are going to use environment variables:

```typescript
export const environment = {
  "host": "MONGO_HOST",
  "port": "MONGO_PORT",
  "mongodb": "MONGOHQ_URL",
};
```

Now it can be used in our `app.ts` like this:

```typescript
import {configuration} from '@rxstack/configuration';
configuration.initialize('./environments');
import {environment} from './environments/environment';

// in development it will return localhost
environment.host
```

### <a name="variable-types"></a> Variable types
`@rxstack/configuration` uses the following variable mechanisms:

- If the value is a valid environment variable (e.v. NODE_ENV), use its value instead
- If the value starts with `./` or `../` turn it into an absolute path relative to the application root path

### <a name="root-path"></a> Root path
You get get root path of your application: `configuration.getRootPath()`

## License

Licensed under the [MIT license](../../LICENSE).

