import {HttpException} from './http.exception';

/**
 * Defines Error class for Forbidden errors, with HTTP status code 403
 */
export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}