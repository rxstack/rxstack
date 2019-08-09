import {Injectable} from 'injection-js';
import {parentPort} from 'worker_threads';
import {AbstractWorkerThread} from '../../src';

@Injectable()
export class StandardWorkerThread extends AbstractWorkerThread {

  async run(): Promise<void> {
    parentPort.postMessage('standard');
  }

  getName(): string {
    return 'standard';
  }
}