import {Transport, HttpMethod} from '@rxstack/core';

export interface OperationMetadata {
  name: string;
  transports: Transport[];
  http_method?: HttpMethod;
  http_path?: string;
  extra?: {[key: string]: any};
}
