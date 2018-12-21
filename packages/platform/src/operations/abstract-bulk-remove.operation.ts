import {HttpMethod, Request, Response} from '@rxstack/core';
import {ApiOperationEvent} from '../events';
import {OperationEventsEnum} from '../enums';
import {ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {BulkRemoveOperationMetadata} from '../metadata';

export abstract class AbstractBulkRemoveOperation<T> extends AbstractOperation {
  metadata: BulkRemoveOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata);
    operationEvent.statusCode = 204;
    operationEvent.eventType = OperationEventsEnum.PRE_BULK_REMOVE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.doRemove(operationEvent.request));
    operationEvent.eventType = OperationEventsEnum.POST_BULK_REMOVE;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    return new Response(operationEvent.getData() , operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'DELETE';
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_BULK_REMOVE,
      OperationEventsEnum.POST_BULK_REMOVE,
    ];
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async doRemove(request: Request): Promise<number> {
    return await this.getService().removeMany(this.getDefaultCriteria(request));
  }

  protected getDefaultCriteria(request: Request): Object {
    const defaultCriteria = {[this.getService().options.idField]: {'$in': request.params.get('ids')}};
    return request.attributes.get('criteria') || defaultCriteria;
  }
}