import {BadRequestException} from './bad-request.exception';
import {ValidationError} from './validation-error';

/**
 * Defines Error class for Validation http-exceptions
 */
export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[], message = 'Validation error') {
    super(message);
    this.data = errors;
  }
}
