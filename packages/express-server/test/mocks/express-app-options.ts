import {express_server_environment} from '../environments/express_server_environment';
import {ConfigurationListener} from './configuration.listener';
import {ExpressModule} from '../../src/express.module';
import {MockController} from './mock.controller';
import {ApplicationOptions} from '@rxstack/core';

export const EXPRESS_APP_OPTIONS: ApplicationOptions = {
  imports: [
    ExpressModule.configure(express_server_environment.express_server)
  ],
  providers: [
    { provide: MockController, useClass: MockController },
    { provide: ConfigurationListener, useClass: ConfigurationListener },
  ],
  servers: express_server_environment.servers
};