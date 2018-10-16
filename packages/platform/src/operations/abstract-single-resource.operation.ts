import {Request} from '@rxstack/core';
import {ResourceInterface, ServiceInterface} from '../interfaces';
import {AbstractOperation} from './abstract-operation';
import {NotFoundException} from '@rxstack/exceptions';
import {RemoveOperationMetadata} from '../metadata/remove-operation.metadata';
import {GetOperationMetadata, WriteOperationMetadata} from '../metadata';

export abstract class AbstractSingleResourceOperation<T extends ResourceInterface> extends AbstractOperation {
  metadata: GetOperationMetadata<T> | WriteOperationMetadata<T> | RemoveOperationMetadata<T>;

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