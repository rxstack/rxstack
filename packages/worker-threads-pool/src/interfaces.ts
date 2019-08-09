import {InjectionToken} from 'injection-js';
import {AbstractWorkerThread} from './abstract-worker-thread';

export const WORKER_THREADS_POOL_REGISTRY = new InjectionToken<AbstractWorkerThread[]>('WORKER_THREADS_POOL_REGISTRY');