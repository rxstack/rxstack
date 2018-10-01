import {Transport} from '@rxstack/core';

export interface ApiOperationMetadata {
  name: string;
  type?: string;
  transports: Transport[];
  http_path?: string;
  extra?: {[key: string]: any};
}
