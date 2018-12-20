import {HttpMethod, Request, Response} from '@rxstack/core';
import {ApiOperationEvent} from '../events';
import {OperationEventsEnum} from '../enums';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';
import {UpdateOperationMetadata} from '../metadata/update-operation.metadata';

export abstract class AbstractUpdateOperation<T> extends AbstractSingleResourceOperation<T> {
  metadata: UpdateOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata);
    operationEvent.statusCode = 204;
    operationEvent.eventType = OperationEventsEnum.PRE_READ;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.findOr404(request));
    operationEvent.eventType = OperationEventsEnum.PRE_UPDATE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.doUpdate(operationEvent.getData(), request));
    operationEvent.eventType = OperationEventsEnum.POST_UPDATE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    return new Response(operationEvent.getData(), operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'PUT';
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_READ,
      OperationEventsEnum.PRE_UPDATE,
      OperationEventsEnum.POST_UPDATE,
    ];
  }

  protected async doUpdate(resource: T, request: Request): Promise<T> {
    return this.getService().updateOne(resource[this.getService().options.idField], request.body);
  }
}