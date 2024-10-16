import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {HttpException} from '@rxstack/exceptions';

describe('Platform:Operation:Get', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  it('@app_task_get ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_get');
    const request = new Request('HTTP');
    request.params.set('id', 'app_task_get');
    const response: Response = await def.handler(request);
    expect(response.statusCode).toBe(200);
    expect(response.content['name']).toBe('my task');
  });

  it('@app_task_get should throw 404', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_get');
    const request = new Request('HTTP');
    request.params.set('id', 'not_found');
    let exception: HttpException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    expect(exception.statusCode).toBe(404);
  });
});
