import {OperationMetadata} from '../../src/metadata';
import {OperationCallback} from '../../src';

export interface CustomOperationMetadata extends OperationMetadata {
  onCustom?: OperationCallback[];
  template: string;
}