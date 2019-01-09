import {Transport, HttpMethod} from '@rxstack/core';

export interface OperationMetadata {
  name: string;
  transports: Transport[];
  httpMethod?: HttpMethod;
  httpPath?: string;
  extra?: {[key: string]: any};
}
