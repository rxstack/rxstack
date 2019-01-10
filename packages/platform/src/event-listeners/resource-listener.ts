import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {
  ApplicationEvents, BootstrapEvent, HttpMetadata, httpMetadataStorage, WebSocketMetadata,
  webSocketMetadataStorage, ResponseEvent, KernelEvents
} from '@rxstack/core';
import {OperationMetadata} from '../metadata/operation.metadata';
import {PLATFORM_OPERATION_KEY} from '../interfaces';
import {AbstractOperation} from '../operations/abstract-operation';
import {Exception} from '@rxstack/exceptions';

@Injectable()
export class ResourceListener {

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
    const metadata: OperationMetadata = Reflect.getMetadata(PLATFORM_OPERATION_KEY, service.constructor);
    service.metadata = metadata;
    service.onInit();
    if (metadata.transports.includes('HTTP')) {
      httpMetadataStorage.add(this.createHttpMetadata(service));
    }
    if (metadata.transports.includes('SOCKET')) {
      webSocketMetadataStorage.add(this.createWebSocketMetadata(service));
    }
  }

  private createHttpMetadata(operation: AbstractOperation): HttpMetadata {
    this.validateHttpMetadata(operation.metadata);
    const routeMetadata = new HttpMetadata();
    routeMetadata.transport = 'HTTP';
    routeMetadata.target = operation.constructor;
    routeMetadata.path = operation.metadata.httpPath;
    routeMetadata.name = operation.metadata.name;
    routeMetadata.propertyKey = 'execute';
    routeMetadata.httpMethod = operation.metadata.httpMethod;
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

  private validateHttpMetadata(metadata: OperationMetadata): void {
    if (!(metadata.httpMethod && metadata.httpPath)) {
      throw new Exception(`HttpMethod or HttpPath is not set in operation: ${metadata.name}`);
    }
  }
}