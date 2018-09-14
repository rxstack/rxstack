import {HttpException} from './http.exception';

/**
 * Defines Error class for Not Acceptable errors, with HTTP status code 406
 */
export class NotAcceptableException extends HttpException {
  constructor(message = 'Not Acceptable') {
    super(message, 406);
  }
}