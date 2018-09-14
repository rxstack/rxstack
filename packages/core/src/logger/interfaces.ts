import {InjectionToken} from 'injection-js';

export type LoggingLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

export interface LoggerTransportInterface {
  createInstance(options: Object): any;
  applyOptions(options: Object): void;
  getName(): string;
}

export interface LoggerHandler {
  type: string;
  options: any;
}

export const LOGGER_TRANSPORT_REGISTRY = new InjectionToken<LoggerTransportInterface[]>('LOGGER_TRANSPORT_REGISTRY');
