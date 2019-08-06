import {Application} from '../../src/application';
import {THREAD_POOL_APP_OPTIONS} from './fixtures/thread-pool-app-options';
import {WorkerPool} from '../../src/thread-pool';
import {workerData} from 'worker_threads';

new Application(THREAD_POOL_APP_OPTIONS).start().then(async (app: Application) => {
  const injector = app.getInjector();
  const workerPool = injector.get(WorkerPool);
  const workerThread = workerPool.get(workerData.name);
  await workerThread.run();
});