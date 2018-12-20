import 'reflect-metadata';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
describe('Platform:Operation:Patch', () => {
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

  it('@app_task_patch ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_patch');
    const request = new Request('HTTP');
    request.params.set('ids', [1]);
    request.body = { 'name': 'patched' };
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(204);
  });

  it('@app_task_patch_with_status_code_200 ', async () => {
    const def = kernel.httpDefinitions.find((def) => def.name === 'app_task_patch');
    const request = new Request('HTTP');
    request.params.set('ids', [1]);
    request.params.set('status_code', 200);
    request.body = { 'name': 'patched' };
    const response: Response = await def.handler(request);
    response.statusCode.should.equal(200);
    response.content.should.be.equal(1);
  });

  it('@app_task_patch_with_response_on_pre_patch', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_patch');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'pre_patch')
    request.body = { 'name': 'patched'};
    const response: Response = await def.handler(request);
    response.content.should.equal('pre_patch');
  });

  it('@app_task_patch_with_response_on_post_patch', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_patch');
    const request = new Request('SOCKET');
    request.params.set('with_response', 'post_patch')
    request.body = { 'name': 'patched'};
    const response: Response = await def.handler(request);
    response.content.should.equal('post_patch');
  });
});
