import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Request} from '@rxstack/core';
import {Injector} from 'injection-js';
import {ApiOperationMetadata} from '../metadata';
import * as _ from 'lodash';

export class ApiOperationEvent extends GenericEvent {

  readonly metadata: ApiOperationMetadata;

  data: any;

  statusCode = 200;

  constructor(public readonly request: Request,
              public readonly injector: Injector,
              metadata: ApiOperationMetadata, public readonly type: string) {
    super();
    this.metadata = _.cloneDeep(metadata);
  }
}