# RxStack DataFixtures Module

> This module aims to provide a simple way to manage and execute the loading of data fixtures.

## Installation

```
npm install @rxstack/data-fixtures --save

// peerDependencies
npm install @rxstack/core@^0.6 @rxstack/exceptions@^0.5 @rxstack/service-registry@^0.5 @rxstack/async-event-dispatcher@^0.5 winston@^3.2.1
```

## Documentation

* [Setup](#setup)
* [Purger](#purger)
* [Create a fixture](#create-fixture)
* [Share fixture result](#share-fixture)
* [Usage in tests](#usage-tests)
* [CLI command](#cli-command)


### <a name="setup"></a>  Setup
`DataFixtures` module needs to be registered in the `application`. 

Let's create the application:

```typescript
import {Application, ApplicationOptions} from '@rxstack/core';
import {DataFixtureModule} from '@rxstack/data-fixtures';

export const APP_OPTIONS: ApplicationOptions = {
  imports: [
    // ...
    DataFixtureModule,
  ],
  servers: [
    // ...
  ], 
  providers: [
    // ...
  ]
};

new Application(APP_OPTIONS).start();
```

### <a name="purger"></a> Purger 
`Purger` is a service responsible to purge the database. By default a `NoopPurger` is registered (which does nothing) but
you can register your own by implementing [PurgerInterface](./src/interfaces.ts):

```typescript
import {Injectable} from 'injection-js';
import {PurgerInterface} from '@rxstack/data-fixtures';

@Injectable()
export class MyPurger implements PurgerInterface {
  async purge(): Promise<void> { 
    // purge database
  }
}
```
then you need to register it in the application providers:

```typescript
import {PURGER_SERVICE} from '@rxstack/data-fixtures';

{
  providers: [
    // ...
    { provide: PURGER_SERVICE, useClass: MyPurger },
  ]
}
```

### <a name="create-fixture"></a>  Create a fixture
Let's create a fixture:

```typescript
import {AbstractFixture} from '@rxstack/data-fixtures';
import {Injectable} from 'injection-js';

@Injectable()
export class MyFixture extends AbstractFixture {

  async load(): Promise<void> {
    const service = '...'; // any persistent service
    
    // save the data
    const result = await service.insertOne({
      'name': 'Nikolay',
      'pasword': 'secret'
    });
    
    // share the result with other fixtures
    this.setReference('result-1', result);
  }
  
  getName(): string {
    return 'my-fixture';
  }
  
  // fixture ordering, defaults to 0
  getOrder(): number {
    return 1;
  }
}
```

and now we need to register it in the application providers:

```typescript
import {FIXTURE_REGISTRY} from '@rxstack/data-fixtures';

{
  providers: [
    // ...
    { provide: FIXTURE_REGISTRY, useClass: MyFixture, multi: true },
  ]
}
```

### <a name="share-fixture"></a>  Share fixture result

Fixtures can be shared using the following methods:

```typescript
import {AbstractFixture} from '@rxstack/data-fixtures';
import {Injectable} from 'injection-js';

@Injectable()
export class MySecondFixture extends AbstractFixture {

  async load(): Promise<void> {
    const result = '...';
    
    // sets the result to the `ReferenceRepository`
    this.setReference('result-2', result);
    
    // gets already added reference from the `ReferenceRepository`, if name does not exist an exception will be thrown
    this.getReference('result-1');
  }

  // ...
}
```

### <a name="usage-in-tests"></a>  Usage in tests
Let's assume you need to load fixtures before you execute a testcase.

```typescript
import 'reflect-metadata';
// ...
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {FixtureManager} from '@rxstack/data-fixtures';

describe('TestcaseWithFixtures', () => {
  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    // purge the database and load fixtures
    await this.injector.get(FixtureManager).execute(true);
  });

  after(async() =>  {
    await app.stop();
  });
  
  // ...
});
```

### <a name="cli-command"></a> CLI command
You can load fixtures from the command line:

```bash
$ npm run cli data-fixtures:load -- --purge=true
```

## License

Licensed under the [MIT license](../../LICENSE).