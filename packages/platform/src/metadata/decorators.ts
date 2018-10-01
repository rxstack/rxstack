import {API_OPERATION_KEY} from '../interfaces';
import {ApiOperationMetadata} from './api-operation.metadata';

export function ApiOperation<T extends ApiOperationMetadata>(metadata: T): ClassDecorator {
  return function (target: Function): void {
    Reflect.defineMetadata(API_OPERATION_KEY, metadata, target);
  };
}