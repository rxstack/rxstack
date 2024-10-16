import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {PLATFORM_APP_OPTIONS} from '../PLATFORM_APP_OPTIONS';
import * as _ from 'lodash';

describe('Platform:Operation:Patch', () => {
  // Setup application

  const app = new Application(PLATFORM_APP_OPTIONS);
  let injector: Injector;
  let kernel: Kernel;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    kernel = injector.get(Kernel);
  });

  it('@app_task_patch ', async () => {
    const def = kernel.webSocketDefinitions.find((def) => def.name === 'app_task_patch');
    const request = new Request('SOCKET');
    request.params.set('ids', [1]);
    request.body = { 'name': 'patched' };
    const response: Response = await def.handler(request);
    expect(response.statusCode).toBe(204);
    expect(_.isEqual(request.attributes.get('criteria'), { id: { '$in': [1] } })).toBeTruthy();
  });
});
