import {
  Request as ExpressRequest, Response as ExpressResponse,
  NextFunction, RequestHandler
} from 'express';
import {Injector} from 'injection-js';

export function expressMiddleware(injector: Injector): RequestHandler {
  return (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {
    response.json({'id': 'express'});
  };
}

export function requestModifierMiddleware(injector: Injector): RequestHandler {
  return (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {
    request.params.custom_param = 'custom_value';
    next();
  };
}

export function exceptionMiddleware(injector: Injector): RequestHandler {
  return (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {
    throw new Error('Custom middleware error');
  };
}
