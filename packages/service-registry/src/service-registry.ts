import {NonExistingServiceException} from './non-existing-service.exception';
import {ExistingServiceException} from './existing-service.exception';
import {NamedServiceInterface} from './named-service.interface';

export class ServiceRegistry<T extends NamedServiceInterface> {

  private registry: Map<string, T> = new Map();

  constructor(services: T[] = []) {
    services.forEach(service => {
      if (!this.has(service.getName())) {
        this.register(service);
      }
    });
  }

  all(): T[] {
    return Array.from(this.registry.values());
  }

  get(name: string): T {
    if (!this.has(name)) {
      throw new NonExistingServiceException(name);
    }
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }

  register(service: T): this {
    if (this.has(service.getName())) {
      throw new ExistingServiceException(service.getName());
    }
    this.registry.set(service.getName(), service);
    return this;
  }

  unregister(name: string): this {
    const service = this.get(name);
    this.registry.delete(service.getName());
    return this;
  }

  reset(): this {
    this.registry.clear();
    return this;
  }
}