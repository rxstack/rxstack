import {Exception} from './exception';

/**
 * Transform an error to exception
 *
 * @param e
 * @returns {Exception}
 */
export function transformToException(e: any): Exception {
  const name = e.name;
  const originalError = e;
  if (!(e instanceof Exception)) {
    e = new Exception(e.message);
    e.name = name;
    e.originalError = originalError;
    e.stack = require('stack-trace').parse(originalError);
  }
  return e;
}