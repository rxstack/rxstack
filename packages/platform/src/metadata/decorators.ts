import {PLATFORM_OPERATION_KEY} from '../interfaces';
import {OperationMetadata} from './operation.metadata';

export function Operation<T extends OperationMetadata>(metadata: T): ClassDecorator {
  return function (target: any): void {
    metadata.extra = metadata.extra || {};
    Reflect.defineMetadata(PLATFORM_OPERATION_KEY, metadata, target);
  };
}
