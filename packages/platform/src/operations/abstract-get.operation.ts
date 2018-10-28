import {HttpMethod, Request, Response} from '@rxstack/core';
import {GetOperationMetadata} from '../metadata/get-operation.metadata';
import {ApiOperationEvent} from '../events';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';

export abstract class AbstractGetOperation<T> extends AbstractSingleResourceOperation<T> {

  metadata: GetOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallbacks(OperationEventsEnum.PRE_READ, this.metadata.onPreRead);
    this.registerOperationCallbacks(OperationEventsEnum.POST_READ, this.metadata.onPostRead);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.GET);
    await this.dispatch(OperationEventsEnum.PRE_READ, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.findOr404(request));
    await this.dispatch(OperationEventsEnum.POST_READ, operationEvent);
    return operationEvent.response ? operationEvent.response : new Response(
      operationEvent.getData(), operationEvent.statusCode
    );
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'GET';
  }
}