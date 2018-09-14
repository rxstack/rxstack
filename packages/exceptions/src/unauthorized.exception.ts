/**
 * Defines Error class for Unauthorized errors, with HTTP status code 401
 */
import {HttpException} from './http.exception';

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}