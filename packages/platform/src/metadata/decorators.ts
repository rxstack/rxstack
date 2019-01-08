import {API_OPERATION_KEY} from '../interfaces';
import {OperationMetadata} from './operation.metadata';

export function Operation<T extends OperationMetadata>(metadata: T): ClassDecorator {
  return function (target: Function): void {
    Reflect.defineMetadata(API_OPERATION_KEY, metadata, target);
  };
}