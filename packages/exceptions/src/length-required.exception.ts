import {HttpException} from './http.exception';

/**
 * Defines Error class for Length Required errors, with HTTP status code 411
 */
export class LengthRequiredException extends HttpException {
  constructor(message = 'Length Required') {
    super(message, 411);
  }
}