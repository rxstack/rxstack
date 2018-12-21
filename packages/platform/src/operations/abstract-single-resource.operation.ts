import {Request} from '@rxstack/core';
import {ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {NotFoundException} from '@rxstack/exceptions';
import {RemoveOperationMetadata} from '../metadata/remove-operation.metadata';
import {GetOperationMetadata, UpdateOperationMetadata} from '../metadata';

export abstract class AbstractSingleResourceOperation<T> extends AbstractOperation {
  metadata: GetOperationMetadata<T> | UpdateOperationMetadata<T> | RemoveOperationMetadata<T>;

  onInit(): void {
    super.onInit();
  }

  protected getService(): ServiceInterface<T> {
    return this.injector.get(this.metadata.service);
  }

  protected async findOr404(request: Request): Promise<T> {
    const resource = await this.getService().findOne(this.getDefaultCriteria(request));
    if (!resource) {
      throw new NotFoundException();
    }
    return resource;
  }

  protected getDefaultCriteria(request: Request): Object {
    const defaultCriteria = {[this.getService().options.idField]: {'$eq': request.params.get('id')}};
    return request.attributes.get('criteria') || defaultCriteria;
  }
}