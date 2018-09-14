import {AbstractServer} from '../../../src/server';
import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '../../../src/application';
import {HttpDefinition, Transport} from '../../../src/kernel';

@Injectable()
export class MockServer extends AbstractServer implements InjectorAwareInterface {
  injector: Injector;
  started = false;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  getEngine(): any {
    return 'mock-engine';
  }

  getTransport(): Transport {
    return 'HTTP';
  }

  async startEngine(): Promise<void> {
    this.started = true;
  }

  async stopEngine(): Promise<void> {
    this.started = false;
  }

  getName(): string {
    return 'mock';
  }

  protected async configure(routeDefinitions: HttpDefinition[]): Promise<void> {
    this.host = 'example.com';
    this.port = 8080;
  }
}