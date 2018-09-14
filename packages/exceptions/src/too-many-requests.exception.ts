import {HttpException} from './http.exception';

/**
 * Defines Error class for Too Many Requests errors, with HTTP status code 429
 */
export class TooManyRequestsException extends HttpException {
  constructor(message = 'Too Many Requests') {
    super(message, 429);
  }
}
