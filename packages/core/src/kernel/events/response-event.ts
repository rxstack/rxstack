import {KernelEvent} from './kernel-event';
import {Request} from '../models/request';
import {Response} from '../models';

/**
 * Allows to modify the response object
 */
export class ResponseEvent extends KernelEvent {
  /**
   * Constructor
   *
   * @param {Request} request
   * @param {Response} response
   */
  constructor(request: Request, response: Response) {
    super(request);
    this.setResponse(response);
  }
}