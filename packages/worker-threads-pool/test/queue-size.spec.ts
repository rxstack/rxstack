import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application} from '@rxstack/core';
import {WorkerThreadsPool} from '../src/index';
import {createAppOptions} from './fixtures/thread-pool-app-options';

describe('WorkerThreadPool:Queue', () => {
  // Setup application
  const app = new Application(createAppOptions(1, 2));
  let injector: Injector;
  let pool: WorkerThreadsPool;

  before(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
  });

  after(async () => {
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

    pool.stats().workerSize.should.be.equal(1);
    pool.stats().queueSize.should.be.equal(2);
  });
});