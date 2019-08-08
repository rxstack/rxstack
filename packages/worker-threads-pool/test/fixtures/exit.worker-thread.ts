import {Injectable} from 'injection-js';
import {AbstractWorkerThread} from '../../src';

@Injectable()
export class ExitWorkerThread extends AbstractWorkerThread {

  async run(): Promise<void> {
    process.exit(23);
  }

  getName(): string {
    return 'exit';
  }
}