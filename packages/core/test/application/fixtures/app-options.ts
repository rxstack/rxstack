import {ApplicationOptions} from '../../../src/application';
import {MockServer} from './mock.server';
import {SERVER_REGISTRY} from '../../../src/server';
import {BootstrapListener} from './bootstrap-listener';
import {app_environment} from '../../environments/app_environment';
import {Test1Module} from './test1.module';
import {Test2Module} from './test2.module';

export const APP_OPTIONS: ApplicationOptions = {
  providers: [
    { provide: BootstrapListener, useClass: BootstrapListener },
    { provide: SERVER_REGISTRY, useClass: MockServer, multi: true },
  ],
  imports: [Test1Module.configure(app_environment.test_module_1), Test2Module],
  servers: app_environment.servers,
};