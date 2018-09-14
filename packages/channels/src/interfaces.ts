import {EventEmitter} from 'events';

export interface Connection extends EventEmitter {}

export type FilterFn = (connection: Connection) => boolean;