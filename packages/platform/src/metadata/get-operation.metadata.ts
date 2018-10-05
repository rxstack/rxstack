import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallable, ResourceInterface, ServiceInterface} from '../interfaces';
import {ClassTransformOptions} from 'class-transformer';

export interface GetOperationMetadata<T extends ResourceInterface> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  classTransformerOptions?: ClassTransformOptions;
  onPreRead?: ApiOperationCallable[];
  onPostRead?: ApiOperationCallable[];
}