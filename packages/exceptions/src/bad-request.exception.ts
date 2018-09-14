import {HttpException} from './http.exception';

/**
 * Defines Error class for Bad Request errors, with HTTP status code 400
 */
export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}