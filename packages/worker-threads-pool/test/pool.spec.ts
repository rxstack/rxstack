import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application} from '@rxstack/core';
import {WorkerThreadsPool} from '../src/index';
import {createAppOptions} from './fixtures/thread-pool-app-options';
import {Exception} from '@rxstack/exceptions';

describe('WorkerThreadPool:Pool', () => {
  // Setup application
  const app = new Application(createAppOptions(3, 2));
  let injector: Injector;
  let pool: WorkerThreadsPool;

  before(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
  });

  after(async () => {
    pool.terminate();
  });

  it('should throw an exception on unknown worker', async () => {
    let exception: Exception;
    try {
      await pool.acquire('unknown');
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(Exception);
  });

  it('#pool size',   (done) => {
    pool.stats().workerSize.should.be.equal(0);
    let cnt = 0;
    const onExit = () => {
      pool.stats().workerSize.should.be.equal(--cnt);
      if (cnt === 0) done();
    };
    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      pool.stats().workerSize.should.be.equal(1);
      worker.on('exit', onExit);
      cnt++;
      pool.acquire('hang', {delay: 1000}).then((worker) => {
        pool.stats().workerSize.should.be.equal(2);
        worker.on('exit', onExit);
        cnt++;
        pool.acquire('hang', {delay: 1000}).then((worker) => {
          pool.stats().workerSize.should.be.equal(3);
          worker.on('exit', onExit);
        });
        pool.stats().workerSize.should.be.equal(3);
      });
      pool.stats().workerSize.should.be.equal(2);
    });
    pool.stats().workerSize.should.be.equal(1);
  });

  it('#pool max size - serial',   (done) => {
    pool.stats().workerSize.should.be.equal(0);
    let cnt = 0;
    let exits = 0;
    const onExit = () => {
      exits++;
      pool.stats().workerSize.should.be.equal(--cnt);
      if (cnt === 0) done();
    };
    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      pool.stats().workerSize.should.be.equal(1);
      worker.on('exit', onExit);
      cnt++;
      pool.acquire('hang', {delay: 1000}).then((worker) => {
        exits.should.be.equal(0);
        pool.stats().workerSize.should.be.equal(2);
        worker.on('exit', onExit);
        cnt++;
        pool.acquire('hang', {delay: 1000}).then((worker) => {
          exits.should.be.equal(0);
          pool.stats().workerSize.should.be.equal(3);
          worker.on('exit', onExit);
          cnt++;
          pool.acquire('hang', {delay: 1000}).then((worker) => {
            exits.should.be.equal(1); // queued
            pool.stats().workerSize.should.be.equal(3);
            worker.on('exit', onExit);
          });
          pool.stats().queueSize.should.be.equal(1);
        });
        pool.stats().workerSize.should.be.equal(3);
      });
      pool.stats().workerSize.should.be.equal(2);
    });
    pool.stats().workerSize.should.be.equal(1);
  });

  it('#pool max size - parallel', (done) => {
    pool.stats().workerSize.should.be.equal(0);
    let cnt = 0;
    let exits = 0;
    const onExit = () => {
      exits++;
      pool.stats().workerSize.should.be.equal(--cnt);
      if (cnt === 0) done();
    };
    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      exits.should.be.equal(0);
      worker.on('exit', onExit);
    });
    pool.stats().workerSize.should.be.equal(1);

    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      exits.should.be.equal(0);
      worker.on('exit', onExit);
    });
    pool.stats().workerSize.should.be.equal(2);

    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      exits.should.be.equal(0);
      worker.on('exit', onExit);
    });
    pool.stats().workerSize.should.be.equal(3);

    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      exits.should.be.equal(1);
      worker.on('exit', onExit);
    });
    pool.stats().workerSize.should.be.equal(3);
    pool.stats().queueSize.should.be.equal(1);
  });
});