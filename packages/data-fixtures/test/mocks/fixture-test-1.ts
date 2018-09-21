import {AbstractFixture} from '../../src';
import {Injectable} from 'injection-js';

@Injectable()
export class FixtureTest1 extends AbstractFixture {

  async load(): Promise<void> {
    this.setReference(this.getName(), 'value-1');
  }

  getName(): string {
    return 'fixture-1';
  }

  getOrder(): number {
    return 1;
  }
}