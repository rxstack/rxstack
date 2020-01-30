import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';

describe('Platform:Operation:Custom', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  before(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  it('@app_task_custom ', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_custom');
    const request = new Request('SOCKET');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content.should.equal('\n    Hello world\n  ');
  });
});
