import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application} from '@rxstack/core';
import {WorkerThreadsPool} from '../src/index';
import {createAppOptions} from './fixtures/thread-pool-app-options';

describe('WorkerThreadPool:terminate', () => {
  // Setup application
  const app = new Application(createAppOptions(10));
  let injector: Injector;
  let pool: WorkerThreadsPool;

  beforeAll(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
  });

  afterAll(async () => {
    pool.terminate();
  });

  it('#pool.terminate()', (done) => {
    let exitCnt = 0;
    pool.acquire('hang', {delay: 1e6}).then((worker) => {
      worker.on('exit', (code) => exitCnt = exitCnt + code);
      worker.on('online', () => {
        pool.acquire('hang', {delay: 1e6}).then((worker) => {
          worker.on('exit', (code) => exitCnt = exitCnt + code);
          worker.on('online', () => {
            pool.terminate();
            setTimeout(() => {
              expect(pool.stats().workerSize).toBe(0);
              expect(exitCnt).toBe(2);
              done();
            }, 1000);
          });
        });
      });
    });
  });
});
