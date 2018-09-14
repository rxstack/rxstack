import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Request} from '../models';
import {Response} from '../models';

/**
 * Base class for kernel events.
 */
export class KernelEvent extends GenericEvent {

  /**
   * Response object
   */
  private response?: Response;

  /**
   * Constructor
   *
   * @param {Request} request
   */
  constructor(private readonly request: Request) {
    super();
  }

  /**
   * Retrieves the request
   *
   * @returns {Request}
   */
  getRequest(): Request {
    return this.request;
  }

  /**
   * Sets the response
   *
   * @param {Response} response
   */
  setResponse(response: Response): void {
    this.response = response;
  }

  /**
   * Retrieves the response
   *
   * @returns {Response}
   */
  getResponse(): Response {
    return this.response;
  }

  /**
   * Checks if response is set
   *
   * @returns {boolean}
   */
  hasResponse(): boolean {
    return !!this.getResponse();
  }
}