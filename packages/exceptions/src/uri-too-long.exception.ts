import {HttpException} from './http.exception';

/**
 * Defines Error class for URI Too Long errors, with HTTP status code 414
 */
export class URITooLongException extends HttpException {
  constructor(message = 'URI Too Long') {
    super(message, 414);
  }
}