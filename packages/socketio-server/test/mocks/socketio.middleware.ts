import {Injector} from 'injection-js';
import {EventEmitter} from 'events';

export function socketMiddleware(injector: Injector) {
  return (socket: EventEmitter, next: Function): void => {
    socket['token'] = 'user token';
    next();
  };
}
