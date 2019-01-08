import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

describe('Platform:Operation:Create', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  after(async() =>  {
    await app.stop();
  });

  it('@app_task_create', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_create');
    const request = new Request('HTTP');
    request.body = { 'name': 'my task' };
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(201);
    response.content['name'].should.equal('my task');
  });

  it('@app_task_create with bulk data', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_create');
    const request = new Request('HTTP');
    request.body = [{ 'name': 'my task' }];
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(201);
    Array.isArray(response.content).should.equal(true);
  });

  it('@app_task_create_with_response_on_init', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_create');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'init')
    request.body = { 'name': 'my task'};
    const response: Response = await def.handler(request);
    response.content.should.equal('init');
  });

  it('@app_task_create_with_response_on_pre_execute', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_create');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'pre_execute')
    request.body = { 'name': 'my task'};
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_execute');
  });

  it('@app_task_create_with_response_on_post_execute', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_create');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'post_execute')
    request.body = { 'name': 'my task'};
    const response: Response = await def.handler(request);
    response.content.should.equal('post_execute');
  });
});
