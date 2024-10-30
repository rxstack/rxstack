import {ApplicationOptions} from '../../../src/application';
import {application_environment} from '../../environments/application_environment';
import {ConnectionListener} from './connection-listener';
import {CustomTransport} from '../../custom-transport.logger';

const winston = require('winston');
winston.add(new CustomTransport());

export const SERVER_APP_OPTIONS: ApplicationOptions = {
  providers: [
    { provide: ConnectionListener, useClass: ConnectionListener }
  ],
  servers: application_environment.servers
};
