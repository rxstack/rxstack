import {HttpMethod, Request, Response} from '@rxstack/core';
import {RemoveOperationMetadata} from '../metadata/remove-operation.metadata';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {ApiOperationEvent} from '../events';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';

export abstract class AbstractRemoveOperation<T> extends AbstractSingleResourceOperation<T> {
  metadata: RemoveOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.REMOVE);
    operationEvent.statusCode = 204;
    operationEvent.setData(await this.findOr404(request));
    operationEvent.eventType = OperationEventsEnum.PRE_REMOVE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    await this.doRemove(request);
    operationEvent.eventType = OperationEventsEnum.POST_REMOVE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    const data = operationEvent.statusCode !== 204 ? operationEvent.getData() : null;
    return new Response(data, operationEvent.statusCode);
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_REMOVE,
      OperationEventsEnum.POST_REMOVE,
    ];
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'DELETE';
  }

  protected async doRemove(request: Request): Promise<void> {
    return this.getService().removeOne(request.params.get('id'));
  }
}