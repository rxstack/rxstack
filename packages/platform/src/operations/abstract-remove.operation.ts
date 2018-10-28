import {HttpMethod, Request, Response} from '@rxstack/core';
import {RemoveOperationMetadata} from '../metadata/remove-operation.metadata';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {ApiOperationEvent} from '../events';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';

export abstract class AbstractRemoveOperation<T> extends AbstractSingleResourceOperation<T> {
  metadata: RemoveOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallbacks(OperationEventsEnum.PRE_REMOVE, this.metadata.onPreRemove);
    this.registerOperationCallbacks(OperationEventsEnum.POST_REMOVE, this.metadata.onPostRemove);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.REMOVE);
    operationEvent.statusCode = 204;
    operationEvent.setData(await this.findOr404(request));
    await this.dispatch(OperationEventsEnum.PRE_REMOVE, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    await this.doRemove(request);
    await this.dispatch(OperationEventsEnum.POST_REMOVE, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    const data = operationEvent.statusCode !== 204 ? operationEvent.getData() : null;
    return new Response(data, operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'DELETE';
  }

  protected async doRemove(request: Request): Promise<void> {
    return this.getService().remove(request.params.get('id'));
  }
}