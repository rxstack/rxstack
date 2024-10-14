import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application} from '@rxstack/core';
import {WorkerThreadsPool} from '../src/index';
import {createAppOptions} from './fixtures/thread-pool-app-options';

describe('WorkerThreadPool:Queue', () => {
  // Setup application
  const app = new Application(createAppOptions(1, 2));
  let injector: Injector;
  let pool: WorkerThreadsPool;

  beforeAll(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
  });

  afterAll(async () => {
    pool.terminate();
  });

  it('#max queue size', (done) => {
    let exists = 3;
    let hasError = 0;
    const onExit = () => {
      if (--exists === 0 && hasError === 1) done();
    };

    pool.acquire('hang', {delay: 1000}).then((worker) => {
      worker.on('exit', onExit);
    });

    pool.acquire('hang', {delay: 1000}).then((worker) => {
      worker.on('exit', onExit);
    });

    pool.acquire('hang', {delay: 1000}).then((worker) => {
      worker.on('exit', onExit);
    });

    pool.acquire('hang', {delay: 1000}).catch((e) => hasError++);

    expect(pool.stats().workerSize).toBe(1);
    expect(pool.stats().queueSize).toBe(2);
  });
});
