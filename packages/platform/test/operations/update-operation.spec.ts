import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

describe('Platform:Operation:Update', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  it('@app_task_update ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_update');
    const request = new Request('HTTP');
    request.params.set('id', 1);
    request.body = { id: 1, 'name': 'my task', completed: false };
    const response: Response = await def.handler(request);
    expect(response.statusCode).toBe(204);
  });
});
