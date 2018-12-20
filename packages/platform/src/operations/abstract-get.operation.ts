import {HttpMethod, Request, Response} from '@rxstack/core';
import {GetOperationMetadata} from '../metadata/get-operation.metadata';
import {ApiOperationEvent} from '../events';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';

export abstract class AbstractGetOperation<T> extends AbstractSingleResourceOperation<T> {
  metadata: GetOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.GET);
    operationEvent.eventType = OperationEventsEnum.PRE_READ;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.findOr404(request));
    operationEvent.eventType = OperationEventsEnum.POST_READ;
    await this.dispatch(operationEvent);
    return operationEvent.response ? operationEvent.response : new Response(
      operationEvent.getData(), operationEvent.statusCode
    );
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_READ,
      OperationEventsEnum.POST_READ,
    ];
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'GET';
  }
}