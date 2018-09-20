import {ReferenceRepository} from './reference-repository';
import {NamedServiceInterface} from '@rxstack/service-registry';
import {Injector} from 'injection-js';
import {InjectorAwareInterface} from '@rxstack/core';

export abstract class AbstractFixture implements InjectorAwareInterface, NamedServiceInterface {

  protected injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  addReference(name: string, value: any): void {
    this.injector.get(ReferenceRepository).addReference(name, value);
  }

  setReference(name: string, value: any): void {
    this.injector.get(ReferenceRepository).setReference(name, value);
  }

  getReference(name: string): any {
    return this.injector.get(ReferenceRepository).getReference(name);
  }

  getOrder(): number {
    return 0;
  }

  abstract load(): Promise<void>;

  abstract getName(): string;
}