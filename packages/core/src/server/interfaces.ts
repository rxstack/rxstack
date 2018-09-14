import {InjectionToken} from 'injection-js';
import {AbstractServer} from './abstract-server';

export const SERVER_REGISTRY = new InjectionToken<AbstractServer[]>('SERVER_REGISTRY');
