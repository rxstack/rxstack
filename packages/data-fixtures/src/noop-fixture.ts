import {AbstractFixture} from './abstract-fixture';
import {Injectable} from 'injection-js';

@Injectable()
export class NoopFixture extends AbstractFixture {
  async load(): Promise<void> {
    // do nothing
  }

  getName(): string {
    return 'noop-fixture';
  }
}
