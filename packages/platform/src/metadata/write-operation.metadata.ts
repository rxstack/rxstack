import {ApiOperationMetadata} from './api-operation.metadata';
import {InjectionToken, Type} from 'injection-js/index';
import {ApiOperationCallable, ResourceInterface, ServiceInterface} from '../interfaces';
import {ValidatorOptions} from 'class-validator';
import {ClassTransformOptions} from 'class-transformer';

export interface WriteOperationMetadata<T extends ResourceInterface> extends ApiOperationMetadata {
  service: Type<ServiceInterface<T>> | InjectionToken<T>;
  type: 'POST' | 'PUT' | 'PATCH';
  classTransformerOptions?: ClassTransformOptions;
  validatorOptions?: ValidatorOptions;
  onPreSetData?: ApiOperationCallable[];
  onPreValidate?: ApiOperationCallable[];
  onPreWrite?: ApiOperationCallable[];
  onPostWrite?: ApiOperationCallable[];
}