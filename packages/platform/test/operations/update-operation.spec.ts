import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

describe('Platform:Operation:Update', () => {
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

  it('@app_task_update ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_update');
    const request = new Request('HTTP');
    request.params.set('id', 1);
    request.body = { id: 1, 'name': 'my task', completed: false };
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(204);
  });


  it('@app_task_update_with_response_on_pre_read', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_update');
    const request = new Request('SOCKET');
    request.params.set('id', 1);
    request.params.set('with_response', 'pre_read');
    request.body = { id: 1, 'name': 'my task', completed: false };
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_read');
  });

  it('@app_task_update_with_response_on_pre_update', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_update');
    const request = new Request('SOCKET');
    request.params.set('id', 1);
    request.params.set('with_response', 'pre_update');
    request.body = { id: 1, 'name': 'my task', completed: false };
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_update');
  });

  it('@app_task_update_with_response_on_post_update', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_update');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'post_update')
    request.body = { id: 1, 'name': 'my task', completed: false };
    const response: Response = await def.handler(request);
    response.content.should.equal('post_update');
  });

});
