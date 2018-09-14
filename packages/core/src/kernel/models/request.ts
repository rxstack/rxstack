import {ParameterBag} from './parameter-bag';
import {FileBag} from './file-bag';
import {HeaderBag} from './header-bag';
import {AttributeBag} from './attribute-bag';
import {HttpMethod, TokenInterface, Transport} from '../interfaces';
import {EventEmitter} from 'events';

/**
 * Container for request data
 */
export class Request {

  /**
   * Headers
   */
  headers: HeaderBag;

  /**
   * Parameters
   */
  params: ParameterBag;

  /**
   * Files
   */
  files: FileBag;

  /**
   *  Body
   */
  body: any;

  /**
   * Extra data
   */
  attributes: AttributeBag;

  /**
   * Route path
   */
  path: string;

  /**
   * Http method
   */
  method?: HttpMethod;

  /**
   * Controller instance
   */
  controller: Object;

  /**
   * Name of the route
   */
  routeName: string;

  /**
   * Security token
   */
  token?: TokenInterface;

  /**
   * Socket connection
   */
  connection?: EventEmitter;

  /**
   * Constructor
   *
   * @param {Transport} transport
   */
  constructor(public readonly transport: Transport) {
    this.headers = new HeaderBag();
    this.params = new ParameterBag();
    this.attributes = new AttributeBag();
    this.files = new FileBag();
  }
}