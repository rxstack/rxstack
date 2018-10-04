import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

const sinon = require('sinon');

describe('Platform:Operation:LIST', () => {
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

  it('@app_task_list should execute successfully', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.attributes.get('query')['limit'].should.be.equal(25);
    request.attributes.get('query')['skip'].should.be.equal(0);
    Array.isArray(response.content).should.be.equal(true);
    response.content[0]['name'].should.be.equal('my task');
  });

  it('@app_task_list_paginated should execute successfully', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_paginated');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['total'].should.be.equal(1);
  });

  it('@app_task_list_with_query should execute successfully', async () => {
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

  it('@app_task_list_with_pre_read should execute successfully', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_pre_read');
    const request = new Request('SOCKET');
    request.params.set('app_task_list_with_pre_read', 'original');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.params.get('app_task_list_with_pre_read').should.be.equal('modified');
    Array.isArray(response.content).should.be.equal(true);
    response.content[0]['name'].should.be.equal('modified by pre-read');
  });

  it('@app_task_list_with_on_query should execute successfully', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_list_with_on_query');
    const request = new Request('SOCKET');
    request.params.set('name', 'original');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    request.attributes.get('query')['where']['name'].should.be.equal('modified');
    response.content[0]['name'].should.be.equal('modified by on-query');
  });
});
