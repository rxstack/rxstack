import {HttpMethod, Request, Response} from '@rxstack/core';
import {ResourceInterface} from '../interfaces';
import {GetOperationMetadata} from '../metadata/get-operation.metadata';
import {ApiOperationEvent} from '../events';
import {classToPlain} from 'class-transformer';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {AbstractSingleResourceOperation} from './abstract-single-resource.operation';

export abstract class AbstractGetOperation<T extends ResourceInterface> extends AbstractSingleResourceOperation<T> {

  metadata: GetOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallables(OperationEventsEnum.PRE_READ, this.metadata.onPreRead);
    this.registerOperationCallables(OperationEventsEnum.POST_READ, this.metadata.onPostRead);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.GET);
    const metadata = operationEvent.metadata as GetOperationMetadata<T>;
    await this.dispatch(OperationEventsEnum.PRE_READ, operationEvent);
    operationEvent.data = await this.findOr404(request);
    await this.dispatch(OperationEventsEnum.POST_READ, operationEvent);
    return new Response(
      classToPlain(operationEvent.data, metadata.classTransformerOptions), operationEvent.statusCode
    );
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'GET';
  }
}