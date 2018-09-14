import {HttpException} from './http.exception';

/**
 * Defines Error class for Unsupported Media Type errors, with HTTP status code 415
 */
export class UnsupportedMediaTypeException extends HttpException {
  constructor(message = 'Unsupported Media Type') {
    super(message, 415);
  }
}