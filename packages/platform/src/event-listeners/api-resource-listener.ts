import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {
  ApplicationEvents, BootstrapEvent, HttpMetadata, httpMetadataStorage, WebSocketMetadata,
  webSocketMetadataStorage, HttpMethod, ResponseEvent, KernelEvents
} from '@rxstack/core';
import {OperationMetadata} from '../metadata/operation.metadata';
import {API_OPERATION_KEY} from '../interfaces';
import {AbstractOperation} from '../operations/abstract-operation';
import {ResourceOperationTypesEnum} from '../enums';

@Injectable()
export class ApiResourceListener {

  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    const injector = event.injector;
    event.resolvedProviders.forEach((provider) => {
      const service = injector.get(provider.key);
      if (service instanceof AbstractOperation) {
        this.register(service);
      }
    });
  }

  @Observe(KernelEvents.KERNEL_RESPONSE, 100)
  async onResponse(event: ResponseEvent): Promise<void> {
    if (event.getRequest().attributes.has('pagination')) {
      const pagination = event.getRequest().attributes.get('pagination');
      event.getResponse().headers.set('x-total', pagination['count']);
      event.getResponse().headers.set('x-limit', pagination['limit']);
      event.getResponse().headers.set('x-skip', pagination['skip']);
    }
  }

  register(service: AbstractOperation): void {
    const metadata: OperationMetadata = Reflect.getMetadata(API_OPERATION_KEY, service.constructor);
    metadata.extra = metadata.extra || {};
    service.metadata = metadata;
    if (metadata.transports.includes('HTTP')) {
      httpMetadataStorage.add(this.createHttpMetadata(service));
    }

    if (metadata.transports.includes('SOCKET')) {
      webSocketMetadataStorage.add(this.createWebSocketMetadata(service));
    }

    service.onInit();
  }

  private createHttpMetadata(operation: AbstractOperation): HttpMetadata {
    const routeMetadata = new HttpMetadata();
    routeMetadata.transport = 'HTTP';
    routeMetadata.target = operation.constructor;
    routeMetadata.path = operation.metadata.http_path;
    routeMetadata.name = operation.metadata.name;
    routeMetadata.propertyKey = 'execute';
    routeMetadata.httpMethod = this.getHttpMethod(operation.metadata);
    return routeMetadata;
  }

  private createWebSocketMetadata(operation: AbstractOperation): WebSocketMetadata {
    const metadata = new WebSocketMetadata();
    metadata.transport = 'SOCKET';
    metadata.target = operation.constructor;
    metadata.name = operation.metadata.name;
    metadata.propertyKey = 'execute';
    return metadata;
  }

  private getHttpMethod(metadata: OperationMetadata): HttpMethod {
    switch (metadata['type']) {
      case ResourceOperationTypesEnum.LIST:
      case ResourceOperationTypesEnum.GET:
        return 'GET';
      case ResourceOperationTypesEnum.CREATE:
        return 'POST';
      case ResourceOperationTypesEnum.UPDATE:
        return 'PUT';
      case ResourceOperationTypesEnum.PATCH:
        return 'PATCH';
      case ResourceOperationTypesEnum.REMOVE:
      case ResourceOperationTypesEnum.BULK_REMOVE:
        return 'DELETE';
      default:
        return 'GET';
    }
  }
}