import {HttpMethod, Transport} from '../interfaces';

export class BaseMetadata {
  target: Function;
  name: string;
  propertyKey: string;
  transport: Transport;
}

export class HttpMetadata extends BaseMetadata {
  path: string;
  httpMethod: HttpMethod;
}

export class WebSocketMetadata extends BaseMetadata { }
