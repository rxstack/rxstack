import {environmentSecurity} from '../environments/environment.security';
import {TestAuthenticationProvider} from './test.authentication-provider';
import {TestTokenManager} from './test.token-manager';
import {Noop2UserProvider} from './noop2-user-provider';
import {PlainTextPasswordEncoder} from '../../src/password-encoders/plain-text.password-encoder';
import {ProviderDefinition, UserInterface} from '@rxstack/core';
import {
  AUTH_PROVIDER_REGISTRY,
  PASSWORD_ENCODER_REGISTRY,
  TOKEN_MANAGER,
  USER_PROVIDER_REGISTRY
} from '../../src/security.module';
import {InMemoryUserProvider} from '../../src/user-providers/in-memory-user-provider';
import {TestController} from './test.controller';
import {TestUserWithEncoder} from './test-user-with-encoder';
import {AuthListener} from './auth.listener';
import {TestJwtAuthenticationProvider} from './test-jwt.authentication-provider';

export const APP_SECURITY_PROVIDERS: ProviderDefinition[] = [
  {
    provide: TestController,
    useClass: TestController
  },
  {
    provide: TOKEN_MANAGER,
    useClass: TestTokenManager
  },
  {
    provide: AuthListener,
    useClass: AuthListener
  },
  {
    provide: PASSWORD_ENCODER_REGISTRY,
    useFactory: () => {
      return new PlainTextPasswordEncoder();
    },
    deps: [],
    multi: true
  },
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: () => {
      return new InMemoryUserProvider<UserInterface>(
        environmentSecurity.user_providers.in_memory.users,
        (data: UserInterface) => new TestUserWithEncoder(data.username, data.password, data.roles)
      );
    },
    deps: [],
    multi: true
  },
  {
    provide: USER_PROVIDER_REGISTRY,
    useClass: Noop2UserProvider,
    multi: true
  },
  {
    provide: AUTH_PROVIDER_REGISTRY,
    useClass: TestAuthenticationProvider,
    multi: true
  },
  {
    provide: AUTH_PROVIDER_REGISTRY,
    useClass: TestJwtAuthenticationProvider,
    multi: true
  },
];