import {AsyncResource} from 'async_hooks';
import {WorkerThreadsPool} from './worker-threads-pool';

export class QueuedWorkerThread extends AsyncResource {
  constructor(private pool: WorkerThreadsPool, private name: string,
              private resolve: any, private reject: any, private options?: any) {
    super('@rxstack/worker-threads-pool:enqueue');
  }

  register(): void {
    this.pool.acquire(this.name, this.options)
      .then(worker => this.runInAsyncScope(this.resolve, null, worker))
      .catch(err => this.runInAsyncScope(this.reject, null, err))
    ;
  }
}