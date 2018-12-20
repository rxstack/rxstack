import {HttpMethod, Request, Response} from '@rxstack/core';
import {ApiOperationEvent} from '../events';
import {OperationEventsEnum} from '../enums';
import {ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {PatchOperationMetadata} from '../metadata/patch-operation.metadata';

export abstract class AbstractPatchOperation<T> extends AbstractOperation {
  metadata: PatchOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata);
    operationEvent.statusCode = 204;
    operationEvent.eventType = OperationEventsEnum.PRE_PATCH;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.doPatch(operationEvent.request));
    operationEvent.eventType = OperationEventsEnum.POST_PATCH;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    return new Response(operationEvent.getData() , operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'PATCH';
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_PATCH,
      OperationEventsEnum.POST_PATCH,
    ];
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async doPatch(request: Request): Promise<number> {
    return await this.getService().updateMany(this.getDefaultCriteria(request), request.body);
  }

  protected getDefaultCriteria(request: Request): Object {
    const defaultCriteria = {[this.getService().options.idField]: {'$in': request.params.get('ids')}};
    return request.attributes.get('criteria') || defaultCriteria;
  }
}