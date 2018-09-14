import {HttpException} from './http.exception';

/**
 * Defines Error class for Insufficient Storage errors, with HTTP status code 507
 */
export class InsufficientStorageException extends HttpException {
  constructor(message = 'Insufficient Storage') {
    super(message, 507);
  }
}