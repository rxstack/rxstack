import {HttpDefinition, WebSocketDefinition} from './interfaces';
import {Injectable, Injector} from 'injection-js';
import {Request, Response} from './models';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Exception, transformToException} from '@rxstack/exceptions';
import {KernelEvents} from './kernel-events';
import {RequestEvent, ResponseEvent, ExceptionEvent} from './events';
import {InjectorAwareInterface} from '../application';
import {HttpMetadata, httpMetadataStorage, WebSocketMetadata, webSocketMetadataStorage} from './metadata';

@Injectable()
export class Kernel implements InjectorAwareInterface {

  httpDefinitions: HttpDefinition[] = [];

  webSocketDefinitions: WebSocketDefinition[] = [];

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  initialize(): void {
    httpMetadataStorage.all().forEach((metadata: HttpMetadata) => {
      this.registerDefinition(metadata);
    });
    webSocketMetadataStorage.all().forEach((metadata: WebSocketMetadata) => {
      this.registerDefinition(metadata);
    });
  }

  reset(): void {
    this.httpDefinitions = [];
    this.webSocketDefinitions = [];
  }

  private registerDefinition(metadata: HttpMetadata|WebSocketMetadata): void {
    // controller instance
    const controller: Object = this.injector.get(metadata.target, false);
    if (!controller) {
      return;
    }
    if (metadata.transport === 'HTTP') {
      this.pushHttpDefinition(<HttpMetadata>metadata, controller);
    } else {
      this.pushWebSocketDefinition(<WebSocketMetadata>metadata, controller);
    }
  }

  private pushHttpDefinition(metadata: HttpMetadata, controller: Object): void {
    const path = `${metadata.path}`.replace(new RegExp('/*$'), '');
    this.httpDefinitions.push({
      path: path,
      name: metadata.name,
      method: metadata.httpMethod,
      handler: async (request: Request): Promise<Response> => {
        request.method = metadata.httpMethod;
        request.path = path;
        request.routeName = metadata.name;
        request.controller = controller;
        return this.process(request, controller, metadata.propertyKey);
      }
    });
  }

  private pushWebSocketDefinition(metadata: WebSocketMetadata, controller: Object): void {
    this.webSocketDefinitions.push({
      name: metadata.name,
      handler: async (request: Request): Promise<Response> => {
        request.routeName = metadata.name;
        request.controller = controller;
        return this.process(request, controller, metadata.propertyKey);
      }
    });
  }

  private async process(request: Request, controller: Object, propertyKey: string): Promise<Response> {
    let response: Response;
    try {
      const requestEvent = new RequestEvent(request);
      await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_REQUEST, requestEvent);
      request = requestEvent.getRequest();

      if (requestEvent.hasResponse()) {
        return await this.handleResponse(requestEvent.getResponse(), request);
      }
      // call controller
      response = await controller[propertyKey].call(controller, request);
      return await this.handleResponse(response, request);
    } catch (e) {
      return await this.handleException(transformToException(e), request);
    }
  }

  private async handleException(exception: Exception, request: Request): Promise<Response> {
    try {
      const exceptionEvent = new ExceptionEvent(exception, request);
      await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_EXCEPTION, exceptionEvent);
      if (exceptionEvent.hasResponse()) {
        return await this.handleResponse(exceptionEvent.getResponse(), request);
      }
      throw exceptionEvent.getException();
    } catch (e) {
      throw transformToException(e);
    }
  }

  private async handleResponse(response: Response, request: Request): Promise<Response> {
    try {
      const responseEvent = new ResponseEvent(request, response);
      await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_RESPONSE, responseEvent);
      return responseEvent.getResponse();
    } catch (e) {
      throw transformToException(e);
    }
  }
}