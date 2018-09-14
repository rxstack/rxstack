import {ApplicationOptions} from '../../../src/application';
import {AnnotatedController} from './annotated.controller';
import {AnnotatedListener} from './annotated-listener';
import {application_environment} from '../../environments/application_environment';

export const KERNEL_APP_OPTIONS: ApplicationOptions = {
  providers: [
    { provide: AnnotatedController, useClass: AnnotatedController },
    { provide: AnnotatedListener, useClass: AnnotatedListener },
  ],
  servers: application_environment.servers,
  logger: application_environment.logger
};