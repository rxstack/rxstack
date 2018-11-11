import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '../../../core/index';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import {HttpException} from '../../../exceptions/index';

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

  it('@app_task_remove_with_pre_remove', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_remove_with_pre_remove');
    const request = new Request('HTTP');
    request.params.set('id', 'app_task_remove_with_pre_remove');
    let exception: HttpException;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.statusCode.should.be.equal(403);
  });

  it('@app_task_remove_with_post_remove ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_remove_with_post_remove');
    const request = new Request('HTTP');
    request.params.set('id', 'app_task_remove');
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content['success'].should.be.equal(true);
  });

  it('@app_task_remove_with_response_on_pre_remove ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_remove_with_response');
    const request = new Request('HTTP');
    request.params.set('with_response', 'pre_remove');
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_remove');
  });

  it('@app_task_remove_with_response_on_post_remove ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_remove_with_response');
    const request = new Request('HTTP');
    request.params.set('with_response', 'post_remove');
    const response: Response = await def.handler(request);
    response.content.should.equal('post_remove');
  });
});