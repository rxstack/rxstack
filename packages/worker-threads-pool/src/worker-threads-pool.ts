import {Injectable} from 'injection-js';
import {ServiceRegistry} from '@rxstack/service-registry';
import {Worker as TWorker} from 'worker_threads';
import {AbstractWorkerThread} from './abstract-worker-thread';
import {QueuedWorkerThread} from './queued-worker-thread';
import {Exception} from '@rxstack/exceptions';
import {WorkerThreadsPoolConfiguration} from './worker-threads-pool.configuration';

const { Worker, SHARE_ENV } = require('worker_threads');

@Injectable()
export class WorkerThreadsPool extends ServiceRegistry<AbstractWorkerThread> {

  protected workers: Set<TWorker> = new Set<TWorker>();

  protected queue: QueuedWorkerThread[] = [];

  constructor(services: AbstractWorkerThread[], protected options: WorkerThreadsPoolConfiguration) {
    super(services);
  }

  acquire(name: string, options?: any): Promise<TWorker> {
    return new Promise((resolve, reject) => {
      if (!this.has(name)) {
        reject(new Exception(`Worker thread with name "${name}" does not exist`));
        return;
      }

      if (this.workers.size >= this.options.max) {
        if (this.queue.length >= this.options.maxWaiting) {
          reject(new Exception('Pool queue is full.'));
          return;
        }
        this.queue.push(new QueuedWorkerThread(this, name, resolve, reject, options));
      } else {
        const worker = new Worker(this.options.path, { env: SHARE_ENV, workerData: {
          name: name,
          options: options
        }});
        this.workers.add(worker);
        worker.once('exit', () => this.removeCurrentWorkerAndStartNextOne(worker));
        resolve(worker);
      }
    });
  }

  stats(): { workerSize: number, queueSize: number } {
    return {
      workerSize: this.workers.size,
      queueSize: this.queue.length
    };
  }

  terminate(): void {
    this.queue = [];
    for (const worker of this.workers) {
      worker.terminate();
    }
  }

  protected removeCurrentWorkerAndStartNextOne(worker: TWorker): void {
    this.workers.delete(worker);
    const resource = this.queue.shift();
    if (resource) resource.register();
  }
}
