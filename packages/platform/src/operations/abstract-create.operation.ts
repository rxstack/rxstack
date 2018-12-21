import {HttpMethod, Request, Response} from '@rxstack/core';
import {ApiOperationEvent} from '../events';
import {OperationEventsEnum} from '../enums';
import {AbstractOperation} from './abstract-operation';
import {ServiceInterface} from '../interfaces';
import {CreateOperationMetadata} from '../metadata/create-operation.metadata';

export abstract class AbstractCreateOperation<T> extends AbstractOperation {
  metadata: CreateOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata);
    operationEvent.statusCode = 201;
    operationEvent.eventType = OperationEventsEnum.PRE_CREATE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.doCreate(operationEvent.request));
    operationEvent.eventType = OperationEventsEnum.POST_CREATE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    return new Response(operationEvent.getData(), operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'POST';
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_CREATE,
      OperationEventsEnum.POST_CREATE,
    ];
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async doCreate(request: Request): Promise<T|T[]> {
    return Array.isArray(request.body) ? this.getService().insertMany(request.body)
      : this.getService().insertOne(request.body);
  }
}