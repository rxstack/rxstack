import {HttpException} from './http.exception';

/**
 * Defines Error class for Not Implemented errors, with HTTP status code 501
 */
export class NotImplementedException extends HttpException {
  constructor(message = 'Not Implemented') {
    super(message, 501);
  }
}