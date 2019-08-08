import {Module, ModuleWithProviders} from '@rxstack/core';
import {WorkerThreadsPoolConfiguration} from './worker-threads-pool.configuration';
import {WORKER_THREADS_POOL_REGISTRY} from './interfaces';
import {NoopWorkerThread} from './noop.worker-thread';
import {WorkerThreadsPool} from './worker-threads-pool';
import {AbstractWorkerThread} from './abstract-worker-thread';

@Module()
export class WorkerThreadsPoolModule {
  static configure(configuration?: WorkerThreadsPoolConfiguration): ModuleWithProviders {
    return {
      module: WorkerThreadsPoolModule,
      providers: [
        { provide: WORKER_THREADS_POOL_REGISTRY, useClass: NoopWorkerThread, multi: true },
        {
          provide: WorkerThreadsPool,
          useFactory: (registry: AbstractWorkerThread[]) => {
            return new WorkerThreadsPool(registry, Object.assign(new WorkerThreadsPoolConfiguration(), configuration));
          },
          deps: [WORKER_THREADS_POOL_REGISTRY]
        }
      ]
    };
  }
}