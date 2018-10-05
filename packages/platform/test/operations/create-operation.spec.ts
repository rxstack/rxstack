import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {HttpException} from '@rxstack/exceptions';
describe('Platform:Operation:CREATE', () => {
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

  it('@app_task_create with validation errors', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_create');
    const request = new Request('HTTP');
    request.body = { 'name': 'my' };

    let exception: HttpException;

    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.equal(400);
    Array.from(exception.data).length.should.equal(1);
  });

});
