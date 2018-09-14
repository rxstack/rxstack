import {LoggerHandler} from './interfaces';

export class LoggerConfiguration {
  handlers: LoggerHandler[] = [];

  constructor(obj: Object) {
    this.handlers = obj['handlers'];
  }
}