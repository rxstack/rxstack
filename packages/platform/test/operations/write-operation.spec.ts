import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {HttpException} from '@rxstack/exceptions';
describe('Platform:Operation:Write', () => {
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

  it('@app_task_create ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_create');
    const request = new Request('HTTP');
    request.body = { 'name': 'my task' };
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(201);
    response.content['name'].should.equal('my task');
  });


  it('@app_task_create_with_pre_write', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_create_with_pre_write');
    const request = new Request('SOCKET');
    request.body = { 'name': 'my task'};
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(201);
    response.content['name'].should.equal('pre_write');
  });

  it('@app_task_create_with_post_write', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_create_with_post_write');
    const request = new Request('SOCKET');
    request.body = { 'name': 'my task'};
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(201);
    response.content['name'].should.equal('post_write');
  });

  it('@app_task_update', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_update');
    const request = new Request('SOCKET');
    request.params.set('id', 'task-1');
    request.body = { 'name': 'my task updated' };
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(204);
  });

  it('@app_task_update with 404', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_update');
    const request = new Request('SOCKET');
    request.params.set('id', 'not_found');
    request.body = { 'name': 'my task updated' };
    let exception: HttpException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.equal(404);
  });

  it('@app_task_create_with_response_on_pre_write', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_create_with_response');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'pre_write')
    request.body = { 'name': 'my task'};
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_write');
  });

  it('@app_task_create_with_response_on_post_write', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_create_with_response');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'post_write')
    request.body = { 'name': 'my task'};
    const response: Response = await def.handler(request);
    response.content.should.equal('post_write');
  });

  it('@app_task_patch', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_patch');
    const request = new Request('SOCKET');
    request.params.set('id', 'task-1')
    request.body = { 'name': 'patched'};
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['name'].should.equal('patched');
  });
});
