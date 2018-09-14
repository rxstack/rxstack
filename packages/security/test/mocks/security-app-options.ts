import {ApplicationOptions} from '@rxstack/core';
import {
  SecurityModule,
} from '../../src/security.module';
import {APP_SECURITY_PROVIDERS} from './app-security-providers';
import {environmentSecurity} from '../environments/environment.security';


export const SECURITY_APP_OPTIONS: ApplicationOptions = {
  imports: [
    SecurityModule.configure(environmentSecurity.security)
  ],
  providers: APP_SECURITY_PROVIDERS,
  servers: environmentSecurity.servers,
  logger: environmentSecurity.logger
};