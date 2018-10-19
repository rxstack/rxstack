import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallback, ResourceInterface, ServiceInterface} from '../interfaces';
import {ClassTransformOptions} from 'class-transformer';

export interface RemoveOperationMetadata<T extends ResourceInterface> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<T>;
  classTransformerOptions?: ClassTransformOptions;
  onPreRemove?: ApiOperationCallback[];
  onPostRemove?: ApiOperationCallback[];
}