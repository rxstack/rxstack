import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Request, Response} from '@rxstack/core';
import {Injector} from 'injection-js';
import {OperationMetadata} from '../metadata';
import * as _ from 'lodash';

export class OperationEvent extends GenericEvent {

  readonly metadata: OperationMetadata;

  statusCode = 200;

  eventType: string;

  private _data: any;

  private _response: Response;

  constructor(public readonly request: Request,
              public readonly injector: Injector,
              metadata: OperationMetadata) {
    super();
    this.metadata = _.cloneDeep(metadata);
  }

  getData<T>(): T {
    return this._data;
  }

  setData<T>(data: T): void {
    this._data = data;
  }

  set response(response: Response) {
    this._response = response;
    this.stopPropagation();
  }

  get response(): Response {
    return this._response;
  }
}