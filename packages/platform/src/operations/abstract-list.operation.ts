import {queryFilter} from '@rxstack/query-filter';
import {HttpMethod, Request, Response} from '@rxstack/core';
import {ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {ListOperationMetadata} from '../metadata/list-operation.metadata';
import {OperationEventsEnum} from '../enums/operation-events.enum';
import {ApiOperationEvent} from '../events';
import * as _ from 'lodash';

export abstract class AbstractListOperation<T> extends AbstractOperation {
  metadata: ListOperationMetadata<T>;

  async execute(request: Request): Promise<Response> {
    const operationEvent = new ApiOperationEvent(request, this.injector, this.metadata);
    const metadata = operationEvent.metadata as ListOperationMetadata<T>;
    operationEvent.eventType = OperationEventsEnum.PRE_COLLECTION_READ;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    this.resolveQueryFilterSchema(metadata);
    const query = queryFilter.createQuery(metadata.queryFilterSchema, request.params.toObject());
    request.attributes.set('query', query);
    operationEvent.eventType = OperationEventsEnum.QUERY;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    operationEvent.setData(await this.findMany(request));
    operationEvent.eventType = OperationEventsEnum.POST_COLLECTION_READ;
    await this.dispatch(operationEvent);
    if (operationEvent.response) {
      return operationEvent.response;
    }
    return new Response(metadata.paginated ? {
      total: await this.getCount(request), data: operationEvent.getData(), limit: query.limit, skip: query.skip
    } : operationEvent.getData(), operationEvent.statusCode);
  }

  getCallbacksKeys(): OperationEventsEnum[] {
    return [
      OperationEventsEnum.PRE_COLLECTION_READ,
      OperationEventsEnum.QUERY,
      OperationEventsEnum.POST_COLLECTION_READ
    ];
  }

  getSupportedHttpMethod(): HttpMethod {
    return 'GET';
  }

  protected async getCount(request: Request): Promise<number> {
    return this.getService().count(request.attributes.get('query').where);
  }

  protected async findMany(request: Request): Promise<T[]> {
    return this.getService().findMany(request.attributes.get('query'));
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