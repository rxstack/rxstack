import {HttpException} from './http.exception';

/**
 * Defines Error class for Not Found errors, with HTTP status code 404
 */
export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}