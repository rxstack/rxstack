import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {HttpException} from '@rxstack/exceptions';

describe('Platform:Operation:Get', () => {
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

  it('@app_task_get ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_get');
    const request = new Request('HTTP');
    request.params.set('id', 'app_task_get');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['name'].should.equal('my task');
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
    exception.statusCode.should.be.equal(404);
  });

  it('@app_task_get_with_pre_read', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_get_with_pre_read');
    const request = new Request('SOCKET');
    request.params.set('pre_read', 'original');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.params.get('pre_read').should.be.equal('modified');
  });

  it('@app_task_get_with_pre_read_and_response', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_get_with_response');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'pre_read');
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_read');
  });

  it('@app_task_get_with_post_read', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_get_with_post_read');
    const request = new Request('HTTP');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['name'].should.equal('modified by post-read');
  });


  it('@app_task_get_with_post_read_and_response', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_get_with_response');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'post_read');
    const response: Response = await def.handler(request);
    response.content.should.equal('post_read');
  });
});
