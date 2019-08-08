import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Context} from './fixtures/context';
import {Application} from '@rxstack/core';
import {WorkerThreadsPool} from '../src';
import {createAppOptions} from './fixtures/thread-pool-app-options';

const asyncHooks = require('async_hooks');

describe('WorkerThreadPool:AsyncHooks', () => {
  // Setup application
  const app = new Application(createAppOptions(1));
  let injector: Injector;
  let pool: WorkerThreadsPool;

  const context = new Context();

  const hook = asyncHooks.createHook({
    init (asyncId: any, type: any, triggerAsyncId: any, resource: any) {
      context.set(asyncId, context.current);
      context.extra = {asyncId, type, triggerAsyncId, resource};
    },
    destroy (asyncId: any) {
      context.delete(asyncId);
    }
  });

  before(async () => {
    injector = await app.run();
    pool = injector.get(WorkerThreadsPool);
    hook.enable();
  });

  after(async () => {
    pool.terminate();
    hook.disable();
  });

  it('#async-hooks', (done) => {
    let workers = 2;

    const onExit = () => {
      if (--workers === 0) done();
    };

    context.current = 1;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      context.current.should.be.equal(1);
      worker.on('exit', onExit);
    });

    context.current = 2;
    pool.acquire('hang', {delay: 1000}).then((worker) => {
      context.current.should.be.equal(2);
      worker.on('exit', onExit);
    });
  });
});