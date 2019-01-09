import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule} from '../src';
import {environmentPlatform} from './environment.platform';
import {InvalidTaskOperation} from './mocks/operations/invalid-task.operation';

export const PLATFORM_APP_OPTIONS_INVALID: ApplicationOptions = {
  imports: [
    PlatformModule
  ],
  providers: [
    { provide: InvalidTaskOperation, useClass: InvalidTaskOperation },
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};