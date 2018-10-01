import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {HttpException} from '@rxstack/exceptions';

const sinon = require('sinon');

describe('Platform:OperationGET:Standard', () => {
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

  it('@app_task_get should execute successfully ', async () => {
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

  it('@app_task_get_with_pre_read should send result on pre-read', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_get_with_pre_read');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['name'].should.equal('modified by pre-read');
  });

  it('@app_task_get_with_post_read should send result on post-read', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_get_with_post_read');
    const request = new Request('HTTP');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['name'].should.equal('modified by post-read');
  });
});
