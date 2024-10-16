import {InjectorAwareInterface, Request, Response} from '@rxstack/core';
import {Injector} from 'injection-js';
import {OperationMetadata} from '../metadata/operation.metadata';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {OperationCallback} from '../interfaces';
import {OperationEvent} from '../events';
import * as _ from 'lodash';
import {OperationEventsEnum} from '../enums';

export abstract class AbstractOperation implements InjectorAwareInterface {
  metadata: OperationMetadata;

  protected injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  onInit(): void {
    const callbackKeys = Object.keys(this.metadata).filter((key: string) => key.match('^on'));
    // @ts-ignore
    callbackKeys.forEach(key => this.registerOperationCallbacks(key.slice(2), this.metadata[key]));
  }

  async execute(request: Request): Promise<Response> {
    const event = new OperationEvent(request, this.injector, this.metadata);
    event.setData(request.attributes.get('data'));
    request.attributes.set('data', undefined);
    event.eventType = OperationEventsEnum.PRE_EXECUTE;
    await this.dispatch(event);
    if (event.response) {
      return event.response;
    }
    await this.doExecute(event);
    event.eventType = OperationEventsEnum.POST_EXECUTE;
    await this.dispatch(event);
    if (event.response) {
      return event.response;
    }
    return new Response(event.getData() , event.statusCode);
  }

  protected getDispatcher(): AsyncEventDispatcher {
    return this.injector.get(AsyncEventDispatcher);
  }

  protected async dispatch(event: OperationEvent): Promise<void> {
    await this.getDispatcher().dispatch(this.getEventName(event.eventType), event);
  }

  protected registerOperationCallbacks(eventType: string, callbacks: OperationCallback[]): void {
    callbacks.forEach((callback): void => {
      this.getDispatcher().addListener(this.getEventName(eventType), callback);
    });
  }

  protected getEventName(eventType: string): string {
    return this.metadata.name + '.' + _.snakeCase(eventType);
  }

  protected abstract doExecute(event: OperationEvent): Promise<void>;
}

