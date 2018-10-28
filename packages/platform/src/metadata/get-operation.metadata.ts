import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallback, ServiceInterface} from '../interfaces';

export interface GetOperationMetadata<T> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  onPreRead?: ApiOperationCallback[];
  onPostRead?: ApiOperationCallback[];
}