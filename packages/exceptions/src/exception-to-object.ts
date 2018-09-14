import {Exception} from './exception';

/**
 * Transform an error to exception
 *
 * @param e
 * @returns {Exception}
 */
export function transformToException(e: any): Exception {
  const errorStack = e.stack;
  if (!(e instanceof Exception)) {
    e = new Exception(e.message);
    e.stack = errorStack;
  }
  return e;
}