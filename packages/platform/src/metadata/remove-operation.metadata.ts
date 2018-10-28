import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallback, ServiceInterface} from '../interfaces';

export interface RemoveOperationMetadata<T> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  onPreRemove?: ApiOperationCallback[];
  onPostRemove?: ApiOperationCallback[];
}