import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {HttpException} from '@rxstack/exceptions';
import * as _ from 'lodash';

describe('Platform:Operation:Get', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  before(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
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
});
