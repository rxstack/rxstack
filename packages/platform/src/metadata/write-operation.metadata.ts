import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallback, ServiceInterface} from '../interfaces';

export interface WriteOperationMetadata<T> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  type: 'POST' | 'PUT' | 'PATCH';
  onPreWrite?: ApiOperationCallback[];
  onPostWrite?: ApiOperationCallback[];
}