import {HttpMethod, Request, Response} from '@rxstack/core';
import {ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {GetOperationMetadata} from '../metadata/get-operation.metadata';
import {NotFoundException} from '@rxstack/exceptions';
import {ApiOperationEvent} from '../events';
import {classToPlain} from 'class-transformer';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {OperationEventsEnum} from '../enums/operation-events.enum';

export abstract class AbstractGetOperation<T> extends AbstractOperation {

  metadata: GetOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallables(OperationEventsEnum.PRE_READ, this.metadata.onPreRead);
    this.registerOperationCallables(OperationEventsEnum.POST_READ, this.metadata.onPostRead);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata);
    operationEvent.type = OperationTypesEnum.GET;
    await this.dispatch(OperationEventsEnum.PRE_READ, operationEvent);
    if (!operationEvent.result) {
      operationEvent.result = await this.findOr404(request);
    }
    await this.dispatch(OperationEventsEnum.POST_READ, operationEvent);
    return new Response(classToPlain(operationEvent.result, this.metadata.classTransformerOptions));
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'GET';
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async findOr404(request: Request): Promise<T> {
    const resource = await this.getService().find(request.params.get('id'));
    if (!resource) {
      throw new NotFoundException();
    }
    return resource;
  }
}