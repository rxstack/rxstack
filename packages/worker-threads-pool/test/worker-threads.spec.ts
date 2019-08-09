import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application} from '@rxstack/core';
import {WorkerThreadsPool} from '../src/index';
import {createAppOptions} from './fixtures/thread-pool-app-options';

describe('WorkerThreadPool:worker-threads', () => {
  // Setup application
  const app = new Application(createAppOptions());
  let injector: Injector;
  let pool: WorkerThreadsPool;

  before(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
  });

  after(async () => {
    pool.terminate();
  });

  it('#standard-worker', (done) => {
    pool.acquire('standard').then((worker) => {
      worker.on('message', (data: any) => {
        if (data === 'standard') {
          done();
        }
      });
    });
  });

  it('#exit-worker', (done) => {
    pool.acquire('exit').then((worker) => {
      worker.on('exit', (data: any) => {
        if (data === 23) {
          done();
        }
      });
    });
  });

  it('#throw-worker', (done) => {
    pool.acquire('throw').then((worker) => {
      worker.on('error', (err: any) => {
        if (err.message === 'boom') {
          done();
        }
      });
    });
  });
});