import {HttpException} from './http.exception';

/**
 * Defines Error class for Method Not Allowed errors, with HTTP status code 405
 */
export class MethodNotAllowedException extends HttpException {
  constructor(message = 'Method Not Allowed') {
    super(message, 405);
  }
}