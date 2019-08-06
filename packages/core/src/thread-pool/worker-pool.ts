import {Injectable} from 'injection-js';
import {WorkerPoolOptions} from './interfaces';
import {ServiceRegistry} from '@rxstack/service-registry';
import {Worker} from 'worker_threads';
import {AbstractWorkerThread} from './abstract-worker-thread';
import {configuration} from '@rxstack/configuration';
import {QueuedWorkerThread} from './queued-worker-thread';

@Injectable()
export class WorkerPool extends ServiceRegistry<AbstractWorkerThread> {

  private workers: Set<Worker> = new Set<Worker>();

  private queue: QueuedWorkerThread[] = [];

  constructor(services: AbstractWorkerThread[] = [], private options: WorkerPoolOptions) {
    super(services);
  }

  acquire(name: string, callback: Function, options?: any): void {
    const promise = new Promise((resolve, reject) => {

    });
    const workerThread = this.get(name);
    if (this.workers.size > this.options.max) {
      this.queue.push(new QueuedWorkerThread(this, name, callback, options));
      return;
    }
    const worker = new Worker(configuration.getRootPath() + '/src/thread-pool/worker.js', { workerData: {
        path: this.options.path,
        name: workerThread.getName(),
        options: options
    }});
    this.workers.add(worker);
    worker.once('error', () => this.handle(worker));
    worker.once('exit', () => this.handle(worker));
    process.nextTick(callback.bind(null, worker));
  }

  stats(): any {
    return {
      size: this.workers.size,
      queue: this.queue.length
    };
  }

  destroy(): any {
    for (let worker of this.workers) {
      worker.terminate();
    }
  }

  private handle(worker: Worker): void {
    this.workers.delete(worker);
    const resource = this.queue.shift();
    if (resource) resource.register();
  }
}