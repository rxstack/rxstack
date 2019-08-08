import {AbstractWorkerThread} from './abstract-worker-thread';
import {Injectable} from 'injection-js';
import {parentPort, threadId} from 'worker_threads';

@Injectable()
export class NoopWorkerThread extends AbstractWorkerThread {

  async run(): Promise<void> {
    parentPort.postMessage({event: 'done', data: 'threadId: ' + threadId});
  }

  getName(): string {
    return 'noop';
  }
}