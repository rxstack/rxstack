import {Request, Response} from '@rxstack/core';
import {OperationEvent} from '../events';
import {ResourceOperationTypesEnum} from '../enums';
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
    this.initializeDefaults(request);
    const singleResourceOperations =
      [ResourceOperationTypesEnum.GET, ResourceOperationTypesEnum.UPDATE, ResourceOperationTypesEnum.REMOVE];
    if (singleResourceOperations.includes(this.metadata.type)) {
      request.attributes.set('data', await this.findOneOr404(request));
    }
    return await super.execute(request);
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async doExecute(event: OperationEvent): Promise<void> {
    await this[this.metadata.type](event);
  }

  protected async findOneOr404(request: Request): Promise<T> {
    const resource = await this.getService().findOne(this.getCriteria(request, '$eq', 'id'));
    if (!resource) {
      throw new NotFoundException();
    }
    return resource;
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
    await this.getService().updateOne(event.getData()[this.getService().options.idField], event.request.body);
    event.statusCode = 204;
  }

  private async patch(event: OperationEvent): Promise<void> {
    event.setData(await this.getService().updateMany(event.request.attributes.get('criteria'), event.request.body));
    event.statusCode = 204;
  }

  private async remove(event: OperationEvent): Promise<void> {
    await this.getService().removeOne(event.getData()[this.getService().options.idField]);
    event.statusCode = 204;
  }

  private async bulkRemove(event: OperationEvent): Promise<void> {
    event.setData(await this.getService().removeMany(event.request.attributes.get('criteria')));
    event.statusCode = 204;
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

  private initializeDefaults(request: Request): void {
    switch (this.metadata.type) {
      case ResourceOperationTypesEnum.LIST:
          request.attributes.set('query', {
            'where': { },
            'limit': this.metadata.extra['limit'] || 25,
            'skip': 0
          });
        break;
      case ResourceOperationTypesEnum.PATCH:
      case ResourceOperationTypesEnum.BULK_REMOVE:
        request.attributes.set('criteria', this.getCriteria(request, '$in', 'ids'));
        break;
    }
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

  private getCriteria(request: Request, filterType: FilterType, param: string): Object {
    return {
      [this.getService().options.idField]: {[filterType]: request.params.get(param)}
    };
  }
}