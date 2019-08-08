import {HangWorkerThread} from './hang.worker-thread';
import {ApplicationOptions} from '@rxstack/core';
import {WORKER_THREADS_POOL_REGISTRY, WorkerThreadsPoolModule} from '../../src';
import {configuration} from '@rxstack/configuration';
import {StandardWorkerThread} from './standard.worker-thread';
import {ExitWorkerThread} from './exit.worker-thread';
import {ThrowWorkerThread} from './throw.worker-thread';

export const createAppOptions = (max = 1, maxWaiting = 2): ApplicationOptions => {
  return {
    imports: [
      WorkerThreadsPoolModule.configure({
        path: __dirname + '/../worker.js',
        max: max,
        maxWaiting: maxWaiting
      })
    ],
    providers: [
      { provide: WORKER_THREADS_POOL_REGISTRY, useClass: HangWorkerThread, multi: true },
      { provide: WORKER_THREADS_POOL_REGISTRY, useClass: StandardWorkerThread, multi: true },
      { provide: WORKER_THREADS_POOL_REGISTRY, useClass: ExitWorkerThread, multi: true },
      { provide: WORKER_THREADS_POOL_REGISTRY, useClass: ThrowWorkerThread, multi: true },
    ],
    servers: [],
    logger: {
      handlers: [
        {
          type: 'console',
          options: {
            level: 'silly',
          }
        }
      ]
    },
  };
};