import {InjectionToken} from 'injection-js';
import {AbstractWorkerThread} from './abstract-worker-thread';

export interface WorkerPoolOptions {
  // filename: string;
  path: string;
  max: number;
  maxWaiting: number;
}

export const THREAD_POOL_REGISTRY = new InjectionToken<AbstractWorkerThread[]>('THREAD_POOL_REGISTRY');