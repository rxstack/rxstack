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
    await app.start();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  after(async() =>  {
    await app.stop();
  });

  it('@app_task_list', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.attributes.get('query')['limit'].should.be.equal(25);
    request.attributes.get('query')['skip'].should.be.equal(0);
    Array.isArray(response.content).should.be.equal(true);
    response.content[0]['name'].should.be.equal('my task');
  });

  it('@app_task_list_paginated', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_paginated');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['total'].should.be.equal(1);
  });

  it('@app_task_list_with_query', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_query');
    const request = new Request('SOCKET');
    request.params.set('$limit', 10);
    request.params.set('$skip', 2);
    request.params.set('name', 'some');
    request.params.set('completed', 'true');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.attributes.get('query')['limit'].should.be.equal(10);
    request.attributes.get('query')['skip'].should.be.equal(2);
  });

  it('@app_task_list_with_pre_read', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_pre_read');
    const request = new Request('SOCKET');
    request.params.set('app_task_list_with_pre_read', 'original');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.params.get('app_task_list_with_pre_read').should.be.equal('modified');
  });

  it('@app_task_list_with_on_query', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_on_query');
    const request = new Request('SOCKET');
    request.params.set('name', 'original');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.attributes.get('query')['where']['name'].should.be.equal('modified');
  });

  it('@app_task_list_with_response_on_pre_read', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_response');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'pre_read');
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_read');
  });

  it('@app_task_list_with_response_on_query', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_response');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'query');
    const response: Response = await def.handler(request);
    response.content.should.equal('query');
  });


  it('@app_task_list_with_response_on_post_read', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_response');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'post_read');
    const response: Response = await def.handler(request);
    response.content.should.equal('post_read');
  });
});
