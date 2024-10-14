import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
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

  beforeAll(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
  });

  afterAll(async () => {
    pool.terminate();
  });

  it('should throw an exception on unknown worker', async () => {
    let exception: Exception;
    try {
      await pool.acquire('unknown');
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(Exception);
  });

  it('#pool size',   (done) => {
    expect(pool.stats().workerSize).toBe(0);
    let cnt = 0;
    const onExit = () => {
      expect(pool.stats().workerSize).toBe(--cnt);
      if (cnt === 0) done();
    };
    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      expect(pool.stats().workerSize).toBe(1);
      worker.on('exit', onExit);
      cnt++;
      pool.acquire('hang', {delay: 1000}).then((worker) => {
        expect(pool.stats().workerSize).toBe(2);
        worker.on('exit', onExit);
        cnt++;
        pool.acquire('hang', {delay: 1000}).then((worker) => {
          expect(pool.stats().workerSize).toBe(3);
          worker.on('exit', onExit);
        });
        expect(pool.stats().workerSize).toBe(3);
      });
      expect(pool.stats().workerSize).toBe(2);
    });
    expect(pool.stats().workerSize).toBe(1);
  });

  it('#pool max size - serial', (done) => {
    expect(pool.stats().workerSize).toBe(0);
    let cnt = 0;
    let exits = 0;
    const onExit = () => {
      exits++;
      expect(pool.stats().workerSize).toBe(--cnt);
      if (cnt === 0) done();
    };
    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      expect(pool.stats().workerSize).toBe(1);
      worker.on('exit', onExit);
      cnt++;
      pool.acquire('hang', {delay: 1000}).then((worker) => {
        expect(exits).toBe(0);
        expect(pool.stats().workerSize).toBe(2);
        worker.on('exit', onExit);
        cnt++;
        pool.acquire('hang', {delay: 1000}).then((worker) => {
          expect(exits).toBe(0);
          expect(pool.stats().workerSize).toBe(3);
          worker.on('exit', onExit);
          cnt++;
          pool.acquire('hang', {delay: 1000}).then((worker) => {
            expect(exits).toBe(1); // queued
            expect(pool.stats().workerSize).toBe(3);
            worker.on('exit', onExit);
          });
          expect(pool.stats().queueSize).toBe(1);
        });
        expect(pool.stats().workerSize).toBe(3);
      });
      expect(pool.stats().workerSize).toBe(2);
    });
    expect(pool.stats().workerSize).toBe(1);
  });

  it('#pool max size - parallel', (done) => {
    expect(pool.stats().workerSize).toBe(0);
    let cnt = 0;
    let exits = 0;
    const onExit = () => {
      exits++;
      expect(pool.stats().workerSize).toBe(--cnt);
      if (cnt === 0) done();
    };
    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      expect(exits).toBe(0);
      worker.on('exit', onExit);
    });
    expect(pool.stats().workerSize).toBe(1);

    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      expect(exits).toBe(0);
      worker.on('exit', onExit);
    });
    expect(pool.stats().workerSize).toBe(2);

    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      expect(exits).toBe(0);
      worker.on('exit', onExit);
    });
    expect(pool.stats().workerSize).toBe(3);

    cnt++;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      expect(exits).toBe(1);
      worker.on('exit', onExit);
    });
    expect(pool.stats().workerSize).toBe(3);
    expect(pool.stats().queueSize).toBe(1);
  });
});
