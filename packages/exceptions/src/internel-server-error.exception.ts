import {HttpException} from './http.exception';

/**
 * Defines Error class for Internal Server Error errors, with HTTP status code 500
 */
export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(message);
  }
}