import {InjectorAwareInterface} from '../application';
import {Injector} from 'injection-js';

export abstract class AbstractCommand implements InjectorAwareInterface {
  command: string;
  describe: string;
  injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  abstract handler(argv: any): Promise<void>;
}