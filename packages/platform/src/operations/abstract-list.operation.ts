import {queryFilter, QueryFilterSchema, QueryInterface} from '@rxstack/query-filter';
import {HttpMethod, Request, Response} from '@rxstack/core';
import {ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {ListOperationMetadata} from '../metadata/list-operation.metadata';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {ApiOperationEvent} from '../events';
import {OperationTypesEnum} from '../enums/operation-types.enum';
import {classToPlain} from 'class-transformer';

export abstract class AbstractListOperation<T> extends AbstractOperation {
  metadata: ListOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.registerOperationCallables(OperationEventsEnum.PRE_READ, this.metadata.onPreRead);
    this.registerOperationCallables(OperationEventsEnum.QUERY, this.metadata.onQuery);
    this.registerOperationCallables(OperationEventsEnum.POST_READ, this.metadata.onPostRead);
  }

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata);
    operationEvent.type = OperationTypesEnum.LIST;

    await this.dispatch(OperationEventsEnum.PRE_READ, operationEvent);
    if (operationEvent.result) {
      return new Response(operationEvent.result);
    }

    const schema: QueryFilterSchema = this.metadata.queryFilterSchema || this.getDefaultQueryFilterSchema();
    const query = queryFilter.createQuery(schema, request.params.toObject());
    request.attributes.set('query', query);

    await this.dispatch(OperationEventsEnum.QUERY, operationEvent);
    if (operationEvent.result) {
      return new Response(operationEvent.result);
    }

    const data = classToPlain(await this.findMany(request), this.metadata.classTransformerOptions);
    operationEvent.result = this.metadata.paginated ? {
      total: await this.getCount(request),
      data: data,
      limit: query.limit,
      skip: query.skip
    } : data;

    await this.dispatch(OperationEventsEnum.POST_READ, operationEvent);
    return new Response(operationEvent.result);
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

  protected getDefaultQueryFilterSchema(): QueryFilterSchema {
    return {
      'properties': { },
      'allowOrOperator': false,
      'defaultLimit': 25
    };
  }
}