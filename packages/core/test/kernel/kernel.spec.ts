import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll, jest} from '@jest/globals';
import {Injector} from 'injection-js';
import {Exception, InternalServerErrorException} from '@rxstack/exceptions';
import {Kernel, Request, Response} from '../../src/kernel';
import {Application} from '../../src/application';
import {KERNEL_APP_OPTIONS} from './fixtures/kernel-app-options';

describe('Kernel', () => {

  // Setup application
  const app = new Application(KERNEL_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  beforeAll(async () => {
    injector = await app.run();
    kernel = injector.get(Kernel);
  });

  afterAll(async () => {
    await app.stop();
  }, 1000);

  it('should call controller index action', async () => {
    const def = kernel.httpDefinitions.find((item) => item.name === 'annotated_index');
    const request = new Request('HTTP');
    const response: Response = await def.handler(request);
    expect(response.statusCode).toBe(200);
    expect(response.content).toBe('AnnotatedController::indexAction');
  });

  it('should throw an exception', async () => {
    const def = kernel.webSocketDefinitions.find((item) => item.name === 'annotated_exception');
    const request = new Request('SOCKET');
    let exception: Exception;

    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }

    expect(exception).toBeInstanceOf(Exception);
    expect(exception.message).toBe('Exception');
  });

  it('should stop after request event is dispatched', async () => {
    const def = kernel.httpDefinitions.find((item) => item.name === 'annotated_index');
    const request = new Request('HTTP');
    request.params.set('type', 'test_request_event');
    const response: Response = await def.handler(request);
    expect(response.content).toBe('modified_by_request_event');
  });

  it('should modify response after response event is dispatched', async () => {
    const def = kernel.httpDefinitions.find((item) => item.name === 'annotated_index');
    const request = new Request('HTTP');
    request.params.set('type', 'test_response_event');
    let response: Response = await def.handler(request);
    expect(response.content).toBe('modified_by_response_event');
  });

  it('should catch exception and return response', async () => {
    const def = kernel.httpDefinitions.find((item) => item.name === 'annotated_exception');
    const request = new Request('HTTP');
    request.params.set('type', 'test_exception_event');
    const response: Response = await def.handler(request);
    expect(response.content).toBe('modified_by_exception_event');
  });

  it('should throw different exception than original one after exception event is dispatched', async () => {
    const def = kernel.httpDefinitions.find((item) => item.name === 'annotated_exception');
    const request = new Request('HTTP');
    request.params.set('type', 'test_exception_event_with_changed_exception');
    let exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(InternalServerErrorException);
  });

  it('should throw an exception after response event is dispatched', async () => {
    const def = kernel.httpDefinitions.find((item) => item.name === 'annotated_index');
    const request = new Request('HTTP');
    request.params.set('type', 'test_response_event_with_exception');
    let exception: Exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(Exception);
    expect(exception.message).toBe('ExceptionInResponseEvent');
  });

  it('should reset', async () => {
    kernel.reset();
    expect(kernel.httpDefinitions.length).toBe(0);
    expect(kernel.webSocketDefinitions.length).toBe(0);
  });
});
