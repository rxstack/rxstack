import {HttpMetadata, WebSocketMetadata} from './metadata';
import {GenericMetadataStorage} from './generic-metadata-storage';

export const httpMetadataStorage = new GenericMetadataStorage<HttpMetadata>();
export const webSocketMetadataStorage = new GenericMetadataStorage<WebSocketMetadata>();
