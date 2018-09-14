import {HttpException} from './http.exception';

/**
 * Defines Error class for Range Not Satisfiable errors, with HTTP status code 416
 */
export class RangeNotSatisfiableException extends HttpException {
  constructor(message = 'Range Not Satisfiable') {
    super(message, 416);
  }
}