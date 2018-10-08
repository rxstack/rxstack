import {queryFilter, QueryFilterSchema, QueryInterface} from '@rxstack/query-filter';
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
    this.registerOperationCallables(OperationEventsEnum.PRE_READ, this.metadata.onPreRead);
    this.registerOperationCallables(OperationEventsEnum.QUERY, this.metadata.onQuery);
    this.registerOperationCallables(OperationEventsEnum.POST_READ, this.metadata.onPostRead);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata, OperationTypesEnum.LIST);
    const metadata = operationEvent.metadata as ListOperationMetadata<T>;
    await this.dispatch(OperationEventsEnum.PRE_READ, operationEvent);
    this.resolveQueryFilterSchema(metadata);
    const query = queryFilter.createQuery(metadata.queryFilterSchema, request.params.toObject());
    request.attributes.set('query', query);

    await this.dispatch(OperationEventsEnum.QUERY, operationEvent);
    const data = classToPlain(await this.findMany(request), metadata.classTransformerOptions);
    operationEvent.data = metadata.paginated ? {
      total: await this.getCount(request),
      data: data,
      limit: query.limit,
      skip: query.skip
    } : data;

    await this.dispatch(OperationEventsEnum.POST_READ, operationEvent);
    return new Response(operationEvent.data, operationEvent.statusCode);
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