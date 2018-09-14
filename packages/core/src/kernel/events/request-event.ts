import {KernelEvent} from './kernel-event';
import {Response} from '../models';

/**
 * Allows to create a response for a request.
 */
export class RequestEvent extends KernelEvent {
  /**
   * Sets the response object
   *
   * @param {Response} response
   */
  setResponse(response: Response): void {
    super.setResponse(response);
    this.stopPropagation();
  }
}