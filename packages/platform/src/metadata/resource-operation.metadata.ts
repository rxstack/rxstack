import {OperationCallback, ServiceInterface} from '../interfaces';
import {InjectionToken, Type} from 'injection-js';
import {OperationMetadata} from './operation.metadata';
import {ResourceOperationTypesEnum} from '../enums';

export interface ResourceOperationMetadata<T> extends OperationMetadata {
  type: ResourceOperationTypesEnum;
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  onInit?: OperationCallback[];
  onPreExecute?: OperationCallback[];
  onPostExecute?: OperationCallback[];
}