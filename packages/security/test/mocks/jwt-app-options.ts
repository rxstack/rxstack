import {ApplicationOptions} from '@rxstack/core';
import {
  SecurityModule,
} from '../../src/security.module';

export function jwt_app_options(options: any): ApplicationOptions {
  return {
    imports: [
      SecurityModule.configure(options.security),
    ],
    servers: options.servers,
    logger: options.logger
  };
}