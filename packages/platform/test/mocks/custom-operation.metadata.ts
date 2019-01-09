import {OperationMetadata} from '../../src/metadata';
import {ApiOperationCallback} from '../../src';

export interface CustomOperationMetadata extends OperationMetadata {
  onCustom?: ApiOperationCallback[];
  template: string;
}