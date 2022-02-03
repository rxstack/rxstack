import {Exception} from './exception';

export function exceptionToObject(e: Exception, context?: any): Record<string, unknown> {
  return {
    message: e.message,
    stack: e.stack,
    data: e.data,
    context: context
  };
}
