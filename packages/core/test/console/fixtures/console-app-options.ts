import {ApplicationOptions} from '../../../src/application';
import {application_environment} from '../../environments/application_environment';
import {COMMAND_REGISTRY} from '../../../src/console';
import {TestCommand} from './test-command';
import {Console1Module} from './console1.module';

export const CONSOLE_APP_OPTIONS: ApplicationOptions = {
  providers: [
    { provide: COMMAND_REGISTRY, useClass: TestCommand, multi: true },
  ],
  imports: [Console1Module],
  servers: application_environment.servers,
  logger: application_environment.logger,
  console: true
};