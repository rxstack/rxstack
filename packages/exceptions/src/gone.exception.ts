import {HttpException} from './http.exception';

/**
 * Defines Error class for Gone errors, with HTTP status code 410
 */
export class GoneException extends HttpException {
  constructor(message = 'Gone') {
    super(message, 410);
  }
}