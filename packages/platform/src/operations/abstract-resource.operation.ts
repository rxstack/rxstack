import {Request, Response} from '@rxstack/core';
import {OperationEvent} from '../events';
import {OperationEventsEnum, ResourceOperationTypesEnum} from '../enums';
import {AbstractOperation} from './abstract-operation';
import {ServiceInterface} from '../interfaces';
import {ResourceOperationMetadata} from '../metadata';
import {NotFoundException} from '@rxstack/exceptions';
import {FilterType, QueryInterface} from '@rxstack/query-filter';

export abstract class AbstractResourceOperation<T> extends AbstractOperation {
  metadata: ResourceOperationMetadata<T>;

  onInit(): void {
    super.onInit();
    this.setHttpMethod();
  }

  async execute(request: Request): Promise<Response> {
    const event = new OperationEvent(request, this.injector, this.metadata);
    this.initializeDefaults(event);
    event.eventType = OperationEventsEnum.INIT;
    await this.dispatch(event);
    if (event.response) {
      return event.response;
    }
    const resourceAwareOperations =
      [ResourceOperationTypesEnum.GET, ResourceOperationTypesEnum.UPDATE, ResourceOperationTypesEnum.REMOVE];
    if (resourceAwareOperations.includes(this.metadata.type)) {
      await this.findOneOr404(event);
    }
    event.eventType = OperationEventsEnum.PRE_EXECUTE;
    await this.dispatch(event);
    if (event.response) {
      return event.response;
    }
    await this.doExecute(event);
    event.eventType = OperationEventsEnum.POST_EXECUTE;
    await this.dispatch(event);
    if (event.response) {
      return event.response;
    }
    return new Response(event.getData() , event.statusCode);
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async doExecute(event: OperationEvent): Promise<void> {
    await this[this.metadata.type](event);
  }

  protected async findOneOr404(event: OperationEvent): Promise<void> {
    const resource = await this.getService().findOne(event.request.attributes.get('criteria'));
    if (!resource) {
      throw new NotFoundException();
    }
    event.setData(resource);
  }

  private async create(event: OperationEvent): Promise<void> {
    const data = event.request.body;
    const result = Array.isArray(data) ? await this.getService().insertMany(data)
      : await this.getService().insertOne(data);
    event.setData(result);
    event.statusCode = 201;
  }

  private async get(event: OperationEvent): Promise<void> { }

  private async update(event: OperationEvent): Promise<void> {
    event.setData(
      await this.getService().updateOne(event.getData()[this.getService().options.idField], event.request.body)
    );
  }

  private async patch(event: OperationEvent): Promise<void> {
    event.setData(await this.getService().updateMany(event.request.attributes.get('criteria'), event.request.body));
  }

  private async remove(event: OperationEvent): Promise<void> {
    await this.getService().removeOne(event.getData()[this.getService().options.idField]);
  }

  private async bulkRemove(event: OperationEvent): Promise<void> {
    event.setData(await this.getService().removeMany(event.request.attributes.get('criteria')));
  }

  private async list(event: OperationEvent): Promise<void> {
    const query: QueryInterface = event.request.attributes.get('query');
    const resources = await this.getService().findMany(query);
    const paginated = !!this.metadata.extra['paginated'];
    const count = paginated ? await this.getService().count(query.where) : resources.length;
    event.setData(resources);
    event.request.attributes.set('pagination', {
      count: count,
      limit: query.limit,
      skip: query.skip
    });
  }

  private initializeDefaults(event: OperationEvent): void {
    const request = event.request;
    switch (this.metadata.type) {
      case ResourceOperationTypesEnum.LIST:
          request.attributes.set('query', {
            'where': { },
            'limit': this.metadata.extra['limit'] || 25,
            'skip': 0
          });
        break;
      case ResourceOperationTypesEnum.GET:
      case ResourceOperationTypesEnum.UPDATE:
      case ResourceOperationTypesEnum.REMOVE:
        this.setCriteria(request, '$eq', 'id');
        break;
      case ResourceOperationTypesEnum.PATCH:
      case ResourceOperationTypesEnum.BULK_REMOVE:
        this.setCriteria(request, '$in', 'ids');
        break;
    }
  }

  private setCriteria(request: Request, filterType: FilterType, param: string): void {
    request.attributes.set('criteria', {
      [this.getService().options.idField]: {[filterType]: request.params.get(param)}
    });
  }

  private setHttpMethod(): void {
    switch (this.metadata.type) {
      case ResourceOperationTypesEnum.LIST:
      case ResourceOperationTypesEnum.GET:
        this.metadata.httpMethod = 'GET';
        break;
      case ResourceOperationTypesEnum.CREATE:
        this.metadata.httpMethod = 'POST';
        break;
      case ResourceOperationTypesEnum.UPDATE:
        this.metadata.httpMethod = 'PUT';
        break;
      case ResourceOperationTypesEnum.PATCH:
        this.metadata.httpMethod = 'PATCH';
        break;
      case ResourceOperationTypesEnum.REMOVE:
      case ResourceOperationTypesEnum.BULK_REMOVE:
        this.metadata.httpMethod = 'DELETE';
        break;
    }
  }
}