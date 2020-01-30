import {ReferenceRepository} from './reference-repository';
import {NamedServiceInterface} from '@rxstack/service-registry';
import {Injector} from 'injection-js';
import {InjectorAwareInterface} from '@rxstack/core';

export abstract class AbstractFixture implements InjectorAwareInterface, NamedServiceInterface {

  protected injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  setReference(name: string, value: any): void {
    this.getReferenceRepository().setReference(name, value);
  }

  getReference(name: string): any {
    return this.getReferenceRepository().getReference(name);
  }

  getOrder(): number {
    return 0;
  }

  getReferenceRepository(): ReferenceRepository {
    return this.injector.get(ReferenceRepository);
  }

  abstract load(): Promise<void>;

  abstract getName(): string;
}