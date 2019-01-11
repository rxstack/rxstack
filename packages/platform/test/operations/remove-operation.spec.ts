import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

describe('Platform:Operation:Remove', () => {
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

  it('@app_task_remove ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_remove');
    const request = new Request('HTTP');
    request.params.set('id', 'app_task_remove');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(204);
  });
});
