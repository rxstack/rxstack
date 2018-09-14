import {HttpException} from './http.exception';

/**
 * Defines Error class for Request Timeout errors, with HTTP status code 408
 */
export class RequestTimeoutException extends HttpException {
  constructor(message = 'Request Timeout') {
    super(message, 408);
  }
}