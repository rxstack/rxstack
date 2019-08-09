import {Injectable} from 'injection-js';
import {workerData} from 'worker_threads';
import {AbstractWorkerThread} from '../../src';

@Injectable()
export class HangWorkerThread extends AbstractWorkerThread {

  async run(): Promise<void> {
    const delay = Number.parseInt(workerData.options.delay);
    setTimeout(() => { }, delay);
  }

  getName(): string {
    return 'hang';
  }
}