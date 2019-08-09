import {NamedServiceInterface} from '@rxstack/service-registry';
import {Injector} from 'injection-js';
import {InjectorAwareInterface} from '@rxstack/core';

export abstract class AbstractWorkerThread implements NamedServiceInterface, InjectorAwareInterface {

  protected injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  abstract run(): Promise<void>;

  abstract getName(): string;
}
