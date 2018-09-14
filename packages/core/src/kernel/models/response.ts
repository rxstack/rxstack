import {HeaderBag} from './header-bag';

/**
 * Container for response data
 */
export class Response {
  /**
   * Headers
   * @type {HeaderBag}
   */
  headers: HeaderBag = new HeaderBag();

  /**
   * Constructor
   *
   * @param content
   * @param {number} statusCode
   */
  constructor(public content?: any, public statusCode = 200) { }
}