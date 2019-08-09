import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application} from '@rxstack/core';
import {WorkerThreadsPool} from '../src/index';
import {createAppOptions} from './fixtures/thread-pool-app-options';

describe('WorkerThreadPool:terminate', () => {
  // Setup application
  const app = new Application(createAppOptions(10));
  let injector: Injector;
  let pool: WorkerThreadsPool;

  before(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
  });

  after(async () => {
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
              pool.stats().workerSize.should.be.equal(0);
              exitCnt.should.be.equal(2);
              done();
            }, 1000);
          });
        });
      });
    });
  });
});