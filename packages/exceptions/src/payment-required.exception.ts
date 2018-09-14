import {HttpException} from './http.exception';

/**
 * Defines Error class for Payment Required errors, with HTTP status code 402
 */
export class PaymentRequiredException extends HttpException {
  constructor(message = 'Payment Required') {
    super(message, 402);
  }
}