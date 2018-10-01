import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Request} from '@rxstack/core';
import {ApiOperationMetadata} from '../metadata/index';
import {Injector} from 'injection-js';

export class ApiOperationEvent extends GenericEvent {

  type: string;

  data: any;

  result: any;

  constructor(public request: Request, public injector: Injector, public metadata: ApiOperationMetadata) {
    super();
  }
}