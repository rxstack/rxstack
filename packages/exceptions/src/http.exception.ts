import {Exception} from './exception';

/**
 * Defines Error class for abstract http exception
 */
export abstract class HttpException extends Exception {
  protected constructor(message: string, public statusCode = 500) {
    super(message);
  }
}