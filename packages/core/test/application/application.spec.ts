import 'reflect-metadata';
import {Application} from '../../src/application';
import {Injector} from 'injection-js';
import {app_environment} from '../environments/app_environment';
import {ServerManager} from '../../src/server';
import {Service2} from './fixtures/service2';
import {Test1ModuleConfiguration} from './fixtures/test1.module';
import {APP_OPTIONS} from './fixtures/app-options';

describe('Application', () => {
  // Setup application
  const app = new Application(APP_OPTIONS);
  let injector: Injector;

  before(async () => {
    await app.start();
    injector = app.getInjector();
  });

  after(async () => {
    await app.stop();
  });

  it('should create the injector', async () => {
    injector.should.not.be.undefined;
  });

  it('should resolve injector aware services', async () => {
    const manager = injector.get(ServerManager);
    manager.getByName('mock')['injector'].should.be.equal(injector);
  });

  it('should resolve imported modules', async () => {
    injector.get(Test1ModuleConfiguration).name.should.be.equal(app_environment.test_module_1.name);
    injector.get(Service2, false).should.be.instanceOf(Service2);
  });

  it('should start the servers', async () => {
    const manager = injector.get(ServerManager);
    manager.getByName('mock')['started'].should.be.true;
  });

  it('should stop the servers', async () => {
    app.stop();
    const manager = injector.get(ServerManager);
    manager.getByName('mock')['started'].should.be.false;
  });
});
