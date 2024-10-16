import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

describe('Platform:Operation:List', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  it('@app_task_list', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.content)).toBeTruthy();
  });

  it('@app_task_list_paginated', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_paginated');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    expect(request.attributes.has('pagination')).toBeTruthy();
    expect(response.statusCode).toBe(200);
    expect(response.headers.get('x-total')).toBe(1);
    expect(response.headers.get('x-limit')).toBe(10);
    expect(response.headers.get('x-skip')).toBe(0);
  });
});
