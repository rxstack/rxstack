import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallable, ServiceInterface} from '../interfaces';

export interface DeleteOperationMetadata<T> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<T>;
  preDelete?: ApiOperationCallable[];
  postDelete?: ApiOperationCallable[];
}