import 'reflect-metadata';
import {Application} from '../../src/application';
import {Injector} from 'injection-js';
import {THREAD_POOL_APP_OPTIONS} from './fixtures/thread-pool-app-options';
import {WorkerPool} from '../../src/thread-pool';
import {Worker} from 'worker_threads';


describe('ThreadPool', () => {
  // Setup application
  const app = new Application(THREAD_POOL_APP_OPTIONS);
  let injector: Injector;
  let pool: WorkerPool;

  before(async () => {
    await app.start();
    injector = app.getInjector();
    pool = injector.get(WorkerPool);
  });

  after(async () => {
    await app.stop();
  });

  it('should ...', (done) => {
    pool.acquire('noop', (worker: Worker) => {
      worker.on('message', (data: any) => {
        if (data['event'] === 'done') {
          done();
        }
      });
    });
  });

});