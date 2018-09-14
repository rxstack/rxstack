import {HttpException} from './http.exception';

/**
 * Defines Error class for Unprocessable Entity errors, with HTTP status code 422
 */
export class UnprocessableEntityException extends HttpException {
  constructor(message = 'Unprocessable Entity') {
    super(message, 422);
  }
}