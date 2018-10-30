import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ServiceInterface} from '../interfaces';

export interface ServiceAwareOperationMetadata<T> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
}