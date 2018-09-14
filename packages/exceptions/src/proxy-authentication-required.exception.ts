import {HttpException} from './http.exception';

/**
 * Defines Error class for Proxy Authentication Required errors, with HTTP status code 407
 */
export class ProxyAuthenticationRequiredException extends HttpException {
  constructor(message = 'Proxy Authentication Required') {
    super(message, 407);
  }
}