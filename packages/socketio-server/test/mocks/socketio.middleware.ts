import {Injector} from 'injection-js';
import {EventEmitter} from 'events';

export function socketMiddleware(injector: Injector) {
  return (socket: any, next: Function): void => {
    socket['token'] = 'user token';
    next();
  };
}
