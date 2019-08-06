import {ApplicationOptions} from '../../../src/application';
import {application_environment} from '../../environments/application_environment';

export const THREAD_POOL_APP_OPTIONS: ApplicationOptions = {
  servers: application_environment.servers,
  logger: application_environment.logger
};