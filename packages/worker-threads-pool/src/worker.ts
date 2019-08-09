import {Application} from '@rxstack/core';
import {isMainThread, workerData} from 'worker_threads';
import {Exception} from '@rxstack/exceptions';
import {WorkerThreadsPool} from './worker-threads-pool';

export class Worker extends Application {
  async execute(): Promise<void> {
    if (isMainThread) {
      throw new Exception('You can not execute a worker on the main thread');
    }
    const injector = await this.run();
    const workerPool = injector.get(WorkerThreadsPool);
    const workerThread = workerPool.get(workerData.name);
    await workerThread.run();
  }
}