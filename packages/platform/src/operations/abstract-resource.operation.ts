import {Request, Response} from '@rxstack/core';
import {OperationEvent} from '../events';
import {ResourceOperationTypesEnum} from '../enums';
import {AbstractOperation} from './abstract-operation';
import {Pagination, ServiceInterface} from '../interfaces';
import {ResourceOperationMetadata} from '../metadata';
import {NotFoundException} from '@rxstack/exceptions';
import {queryFilter, QueryFilterSchema, QueryInterface} from '@rxstack/query-filter';

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
    const resource = await this.getService().find(request.params.get('id'));
    if (!resource) {
      throw new NotFoundException();
    }
    return resource;
  }

  private async create(event: OperationEvent): Promise<void> {
    const result = await this.getService().insertOne(event.request.body);
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

  private async bulkCreate(event: OperationEvent): Promise<void> {
    event.setData(await this.getService().insertMany(event.request.body));
    event.statusCode = 201;
  }

  private async bulkRemove(event: OperationEvent): Promise<void> {
    event.setData(await this.getService().removeMany(event.request.attributes.get('criteria')));
    event.statusCode = 204;
  }

  private async list(event: OperationEvent): Promise<void> {
    const query: QueryInterface = event.request.attributes.get('query');
    const resources = await this.getService().findMany(query);
    event.setData(resources);
    const paginated = this.metadata.pagination && this.metadata.pagination.enabled;
    if (paginated) {
      const pagination: Pagination = {
        count: await this.getService().count(query.where),
        limit: query.limit,
        skip: query.skip
      };
      event.request.attributes.set('pagination', pagination);
    }
  }

  private initializeDefaults(request: Request): void {
    switch (this.metadata.type) {
      case ResourceOperationTypesEnum.LIST:
          const limit = this.metadata.pagination && this.metadata.pagination.limit
            ? this.metadata.pagination.limit : this.getService().options.defaultLimit;

          const defaultSchema: QueryFilterSchema = {
            properties: {},
            defaultLimit: limit
          };
          const query = queryFilter.createQuery(defaultSchema, request.params.toObject());
          request.attributes.set('query', query);
        break;
      case ResourceOperationTypesEnum.PATCH:
      case ResourceOperationTypesEnum.BULK_REMOVE:
        request.attributes.set('criteria', {[this.getService().options.idField]: {'$in': request.params.get('ids')}});
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
      case ResourceOperationTypesEnum.BULK_CREATE:
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