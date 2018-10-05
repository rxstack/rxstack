import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Request} from '@rxstack/core';
import {Injector} from 'injection-js';
import {ApiOperationMetadata} from '../metadata';

export class ApiOperationEvent extends GenericEvent {

  data: any;

  statusCode = 200;

  constructor(public readonly request: Request,
              public readonly injector: Injector,
              public metadata: ApiOperationMetadata, public readonly type: string) {
    super();
  }
}