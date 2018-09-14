import {KernelEvent} from './kernel-event';
import {Exception} from '@rxstack/exceptions';
import {Response, Request} from '../models';

/**
 * Allows to create a response for a thrown exception.
 */
export class ExceptionEvent extends KernelEvent {
  /**
   * Constructor
   *
   * @param {Exception} exception
   * @param {Request} request
   */
  constructor(private exception: Exception, request: Request) {
    super(request);
  }

  /**
   * Sets the response object
   *
   * @param {Response} response
   */
  setResponse(response: Response): void {
    super.setResponse(response);
    this.stopPropagation();
  }

  /**
   * Replaces the thrown exception.
   *
   * @param {Exception} exception
   */
  setException(exception: Exception): void {
    this.exception = exception;
  }

  /**
   * Retrieves the exception
   *
   * @returns {Exception}
   */
  getException(): Exception {
    return this.exception;
  }
}