import {WriteOperationMetadata} from '../metadata';
import {HttpMethod, Request, Response} from '@rxstack/core';
import {ApiOperationEvent} from '../events';
import {OperationTypesEnum, OperationEventsEnum} from '../enums';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';

export abstract class AbstractWriteOperation<T> extends AbstractSingleResourceOperation<T> {
  metadata: WriteOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.WRITE);
    const metadata = operationEvent.metadata as WriteOperationMetadata<T>;
    operationEvent.statusCode = metadata.type === 'POST' ? 201 : 204;
    const data = metadata.type === 'POST' ? null : await this.findOr404(request);
    operationEvent.setData(data);
    await this.dispatch(OperationEventsEnum.PRE_WRITE, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.doWrite(operationEvent.request));
    await this.dispatch(OperationEventsEnum.POST_WRITE, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    const responseData = operationEvent.statusCode !== 204 ? operationEvent.getData() : null;
    return new Response(responseData, operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return this.metadata.type;
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_WRITE,
      OperationEventsEnum.POST_WRITE,
    ];
  }

  protected async doWrite(request: Request): Promise<T> {

    switch (this.metadata.type) {
      case 'POST':
        return this.getService().create(request.body);
      case 'PUT':
        return this.getService().replace(request.params.get('id'), request.body);
      case 'PATCH':
        return this.getService().patch(request.params.get('id'), request.body);
    }
  }
}