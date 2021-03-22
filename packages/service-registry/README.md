# The Service Registry

> Simple registry component useful for all types of applications.

## Installation

```
npm install @rxstack/service-registry --save

// peerDependencies
npm install @rxstack/exceptions@^0.6
```

## Documentation

* [Usage](#usage)
* [Exceptions](#exceptions)

## <a name="usage"></a>  Usage
A registry object acts as a collection of objects. It allows you to store objects which implement a specific interface.

Each service should implement `NamedServiceInterface`:


```typescript
    import {NamedServiceInterface} from '@rxstack/registry';

    export class MyService implements NamedServiceInterface {
      getName(): string {
        return 'service-1';
      }
    }
```

Here we go:

```typescript
    import {ServiceRegistry} from '@rxstack/registry';

    const registry = new ServiceRegistry<MyServiceInterface>();
    registry.register(new MyService1());
    registry.register(new MyService2());
    
    registry.has('service-1'); // should return true
    registry.get('service-1'); // should get service instance
    registry.all(); // should retun an array of all registered service
    registry.reset(); // clears all services from registry
```

Removing a service from the registry is as easy as adding:

```typescript
// ...
registry.unregister('service-1');
registry.has('service-1'); //should return false
```

## <a name="exceptions"></a>  Exceptions

`ExistingServiceException` is thrown when you try to register a service that is already in the registry.

`NonExistingServiceException` is thrown when you try to unregister or get a service which is not in the registry.


## License

Licensed under the [MIT license](LICENSE).
