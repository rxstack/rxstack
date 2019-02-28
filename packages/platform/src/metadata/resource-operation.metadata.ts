import {OperationCallback, ServiceInterface} from '../interfaces';
import {InjectionToken, Type} from 'injection-js';
import {OperationMetadata} from './operation.metadata';
import {ResourceOperationTypesEnum} from '../enums';

export interface ResourceOperationMetadata<T> extends OperationMetadata {
  type: ResourceOperationTypesEnum;
  service: Type<ServiceInterface<T>> | InjectionToken<ServiceInterface<T>>;
  onPreExecute?: OperationCallback[];
  onPostExecute?: OperationCallback[];
  pagination?: {
    enabled: boolean;
    limit?: number;
  };
}