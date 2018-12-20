import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {
  ApplicationEvents, BootstrapEvent, HttpMetadata, httpMetadataStorage, WebSocketMetadata,
  webSocketMetadataStorage
} from '@rxstack/core';
import {ApiOperationMetadata} from '../metadata/api-operation.metadata';
import {API_OPERATION_KEY} from '../interfaces';
import {AbstractOperation} from '../operations/abstract-operation';
import {KernelEvents} from '../../../core/src/kernel/kernel-events';
import {ResponseEvent} from '../../../core/src/kernel/events/response-event';

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

  @Observe(KernelEvents.KERNEL_RESPONSE)
  async onResponse(event: ResponseEvent): Promise<void> {
    if (event.getResponse().statusCode === 204) {
      event.getResponse().content = null;
    }
  }

  register(service: AbstractOperation): void {
    const metadata: ApiOperationMetadata = Reflect.getMetadata(API_OPERATION_KEY, service.constructor);
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
    routeMetadata.httpMethod = operation.getSupportedHttpMethod();
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
}