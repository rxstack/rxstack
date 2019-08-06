import {AsyncResource} from 'async_hooks';
import {WorkerPool} from './worker-pool';
import {Worker} from 'worker_threads';

export class QueuedWorkerThread extends AsyncResource {
  constructor(public pool: WorkerPool, public name: string, public callback: any, public options?: any) {
    super('worker-thread: ' + name);
  }

  register() {
    this.pool.acquire(this.name, (worker: Worker) => {
      this.runInAsyncScope(this.callback, null,  worker);
    }, this.options);
  }
}