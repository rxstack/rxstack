import {HttpException} from './http.exception';

/**
 * Defines Error class for Payload Too Large errors, with HTTP status code 413
 */
export class PayloadTooLargeException extends HttpException {
  constructor(message = 'Payload Too Large') {
    super(message, 413);
  }
}