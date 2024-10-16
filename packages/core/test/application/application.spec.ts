import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '../../src/application';
import {Injector} from 'injection-js';
import {app_environment} from '../environments/app_environment';
import {ServerManager} from '../../src/server';
import {Service2} from './fixtures/service2';
import {Test1ModuleConfiguration} from './fixtures/test1.module';
import {APP_OPTIONS} from './fixtures/app-options';
import {MockServer} from './fixtures/mock.server';

describe('Application', () => {
  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;

  beforeAll(async () => {
    await app.start();
    injector = app.getInjector();
  });

  afterAll(async () => {
    await app.stop();
  }, 1000);

  it('should create the injector', async () => {
    expect(injector).toBeDefined();
  });

  it('should resolve injector aware services', async () => {
    const manager = injector.get(ServerManager);
    expect(manager.getByName('mock')['injector']).toBe(injector);
  });

  it('should resolve imported modules', async () => {
    expect(injector.get(Test1ModuleConfiguration).name).toBe(app_environment.test_module_1.name);
    expect(injector.get(Service2, false)).toBeInstanceOf(Service2);
  });

  it('should start the servers', async () => {
    const manager = injector.get(ServerManager);
    const mockServer = manager.getByName('mock')as MockServer;
    expect(mockServer.started).toBeTruthy();
  });

  it('should stop the servers', async () => {
    await app.stop();
    const manager = injector.get(ServerManager);
    const mockServer = manager.getByName('mock')as MockServer;
    expect(mockServer.started).toBeFalsy();
  });
});
