import {HttpException} from './http.exception';

/**
 * Defines Error class for Unavailable For Legal Reasons errors, with HTTP status code 451
 */
export class UnavailableForLegalReasonsException extends HttpException {
  constructor(message = 'Unavailable For Legal Reasons') {
    super(message, 451);
  }
}