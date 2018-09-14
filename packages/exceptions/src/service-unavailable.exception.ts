import {HttpException} from './http.exception';

/**
 * Defines Error class for Service Unavailable errors, with HTTP status code 503
 */
export class ServiceUnavailableException extends HttpException {
  constructor(message = 'Service Unavailable') {
    super(message, 503);
  }
}