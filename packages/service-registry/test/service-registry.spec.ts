import {describe, expect, it} from '@jest/globals';
import {MockService} from './mock.service';
import {ServiceRegistry} from '../src';

describe('Registry', () => {
  let registry = new ServiceRegistry();
  const service = new MockService();

  it('should register service and retrieve it', async () => {
      registry.register(service);
      expect(registry.get(service.getName())).toBeInstanceOf(MockService);
  });

  it('should fetch all services', async () => {
    expect(registry.all().length).toBe(1);
  });

  it('should throw ExistingServiceException when register an existing service', async () => {
    const fn = () => {
      registry.register(service);
    };
    expect(fn).toThrow();
  });

  it('should throw NonExistingServiceException', async () => {
    const fn = () => {
      registry.get('non-existing');
    };
    expect(fn).toThrow();
  });

  it('should unregister service', async () => {
    registry.unregister(service.getName());
    expect(registry.has(service.getName())).toBeFalsy();
  });

  it('should throw NonExistingServiceException when unregister', async () => {
    const fn = () => {
      registry.unregister(service.getName());
    };
    expect(fn).toThrow();
  });

  it('should register services in the constructor', async () => {
    registry = new ServiceRegistry([service, service]);
    expect(registry.all().length).toBe(1);
  });

  it('should reset all services', async () => {
    registry.reset();
    expect(registry.all().length).toBe(0);
  });
});
