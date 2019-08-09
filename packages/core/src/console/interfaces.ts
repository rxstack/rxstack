import {InjectionToken} from 'injection-js';
import {AbstractCommand} from './abstract-command';

export const COMMAND_REGISTRY = new InjectionToken<AbstractCommand[]>('COMMAND_REGISTRY');