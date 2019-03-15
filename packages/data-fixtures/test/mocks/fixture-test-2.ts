import {AbstractFixture} from '../../src';
import {Injectable} from 'injection-js';

@Injectable()
export class FixtureTest2 extends AbstractFixture {

  async load(): Promise<void> {
    this.setReference(this.getName(), 'value-2');
  }

  getName(): string {
    return 'fixture-2';
  }

  getOrder(): number {
    return 2;
  }
}