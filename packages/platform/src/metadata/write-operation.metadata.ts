import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallable, ServiceInterface, Validation} from '../interfaces';

export interface WriteOperationMetadata<T> extends ApiOperationMetadata {
  type: 'POST' | 'PATCH' | 'PUT';
  service: Type<ServiceInterface<T>> | InjectionToken<T>;
  validation: Validation;
  preValidate?: ApiOperationCallable[];
  postValidate?: ApiOperationCallable[];
  preWrite?: ApiOperationCallable[];
  postWrite?: ApiOperationCallable[];
}