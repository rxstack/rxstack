import {HttpMethod, InjectorAwareInterface, Request, Response} from '@rxstack/core';
import {Injector} from 'injection-js';
import {ApiOperationMetadata} from '../metadata/api-operation.metadata';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ApiOperationCallback} from '../interfaces';
import {ApiOperationEvent} from '../events';
import {OperationEventsEnum} from '../enums/operation-events.enum';

export abstract class AbstractOperation implements InjectorAwareInterface {

  metadata: ApiOperationMetadata;

  protected injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  onInit(): void {
    this.getCallbacksKeys().forEach(key =>
      this.registerOperationCallbacks(key, this.metadata['on' + key.charAt(0).toUpperCase() + key.slice(1)]));
  }

  protected getDispatcher(): AsyncEventDispatcher {
    return this.injector.get(AsyncEventDispatcher);
  }

  protected async dispatch(event: ApiOperationEvent): Promise<void> {
    await this.getDispatcher().dispatch(this.metadata.name + '.' + event.eventType, event);
  }

  protected registerOperationCallbacks(name: string, callbacks?: ApiOperationCallback[]): void {
    if (callbacks) {
      callbacks.forEach((callback): void => {
        this.getDispatcher().addListener(this.metadata.name + '.' + name, callback);
      });
    }
  }

  abstract execute(request: Request): Promise<Response>;

  abstract getSupportedHttpMethod(): HttpMethod;

  abstract getCallbacksKeys(): OperationEventsEnum[];
}

