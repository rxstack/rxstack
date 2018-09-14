import {HttpException} from './http.exception';

/**
 * Defines Error class for Expectation Failed errors, with HTTP status code 417
 */
export class ExpectationFailedException extends HttpException {
  constructor(message = 'Expectation Failed') {
    super(message, 417);
  }
}