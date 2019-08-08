import 'reflect-metadata';
import {Worker} from '../src';
import {createAppOptions} from './fixtures/thread-pool-app-options';

new Worker(createAppOptions()).execute().catch((err) => process.nextTick(() => {
  throw err;
}));