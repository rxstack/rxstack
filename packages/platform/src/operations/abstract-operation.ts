import {InjectorAwareInterface, Request, Response} from '@rxstack/core';
import {Injector} from 'injection-js';
import {OperationMetadata} from '../metadata/operation.metadata';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ApiOperationCallback} from '../interfaces';
import {OperationEvent} from '../events';
import * as _ from 'lodash';

export abstract class AbstractOperation implements InjectorAwareInterface {
  metadata: OperationMetadata;

  protected injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  onInit(): void {
    const callbackKeys = Object.keys(this.metadata).filter((key: string) => key.match('^on'));
    callbackKeys.forEach(key => this.registerOperationCallbacks(key.slice(2), this.metadata[key]));
  }

  protected getDispatcher(): AsyncEventDispatcher {
    return this.injector.get(AsyncEventDispatcher);
  }

  protected async dispatch(event: OperationEvent): Promise<void> {
    await this.getDispatcher().dispatch(this.getEventName(event.eventType), event);
  }

  protected registerOperationCallbacks(eventType: string, callbacks?: ApiOperationCallback[]): void {
    callbacks.forEach((callback): void => {
      this.getDispatcher().addListener(this.getEventName(eventType), callback);
    });
  }

  protected getEventName(eventType: string): string {
    return this.metadata.name + '.' + _.snakeCase(eventType);
  }

  abstract execute(request: Request): Promise<Response>;
}

