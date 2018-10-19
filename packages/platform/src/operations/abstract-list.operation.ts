import {queryFilter, QueryInterface} from '@rxstack/query-filter';
import {HttpMethod, Request, Response} from '@rxstack/core';
import {ResourceInterface, ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {ListOperationMetadata} from '../metadata/list-operation.metadata';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {ApiOperationEvent} from '../events';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {classToPlain} from 'class-transformer';
import * as _ from 'lodash';

export abstract class AbstractListOperation<T extends ResourceInterface> extends AbstractOperation {
  metadata: ListOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallbacks(OperationEventsEnum.PRE_READ, this.metadata.onPreRead);
    this.registerOperationCallbacks(OperationEventsEnum.QUERY, this.metadata.onQuery);
    this.registerOperationCallbacks(OperationEventsEnum.POST_READ, this.metadata.onPostRead);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.LIST);
    const metadata = operationEvent.metadata as ListOperationMetadata<T>;
    await this.dispatch(OperationEventsEnum.PRE_READ, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    this.resolveQueryFilterSchema(metadata);
    const query = queryFilter.createQuery(metadata.queryFilterSchema, request.params.toObject());
    request.attributes.set('query', query);

    await this.dispatch(OperationEventsEnum.QUERY, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.findMany(request));
    await this.dispatch(OperationEventsEnum.POST_READ, operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    const transformedData = classToPlain(operationEvent.getData(), metadata.classTransformerOptions);
    const responseData = metadata.paginated ? {
      total: await this.getCount(request),
      data: transformedData,
      limit: query.limit,
      skip: query.skip
    } : transformedData;

    return new Response(responseData, operationEvent.statusCode);
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'GET';
  }

  protected async getCount(request: Request): Promise<number> {
    const query = <QueryInterface>request.attributes.get('query');
    return this.getService().count(query.where);
  }

  protected async findMany(request: Request): Promise<T[]> {
    const query = <QueryInterface>request.attributes.get('query');
    return this.getService().findMany(query);
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  private resolveQueryFilterSchema(metadata: ListOperationMetadata<T>): void {
    const schema = metadata.queryFilterSchema;
    const defaults =  {
      'properties': { },
      'allowOrOperator': false,
      'defaultLimit': 25
    };
    metadata.queryFilterSchema = schema ? _.merge(defaults, schema) : defaults;
  }
}