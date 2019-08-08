import {Injectable} from 'injection-js';
import {AbstractWorkerThread} from '../../src';

@Injectable()
export class ThrowWorkerThread extends AbstractWorkerThread {

  async run(): Promise<void> {
    throw new Error('boom');
  }

  getName(): string {
    return 'throw';
  }
}