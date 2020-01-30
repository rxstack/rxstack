import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

describe('Platform:Operation:List', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  before(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  it('@app_task_list', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    Array.isArray(response.content).should.be.equal(true);
  });

  it('@app_task_list_paginated', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_paginated');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    request.attributes.has('pagination').should.be.equal(true);
    response.statusCode.should.equal(200);
    response.headers.get('x-total').should.be.equal(1);
    response.headers.get('x-limit').should.be.equal(10);
    response.headers.get('x-skip').should.be.equal(0);
  });
});
