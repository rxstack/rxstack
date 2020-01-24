import {environmentSecurity} from '../environments/environment.security';
import {TestAuthenticationProvider} from './test.authentication-provider';
import {TestTokenEncoder} from './test.token-encoder';
import {Noop2UserProvider} from './noop2-user-provider';
import {ProviderDefinition, UserInterface} from '@rxstack/core';
import {InMemoryUserProvider} from '../../src/user-providers/in-memory-user-provider';
import {TestController} from './test.controller';
import {TestUserWithEncoder} from './test-user-with-encoder';
import {AuthListener} from './auth.listener';
import {TestJwtAuthenticationProvider} from './test-jwt.authentication-provider';
import {AUTH_PROVIDER_REGISTRY, TOKEN_ENCODER, TOKEN_MANAGER, USER_PROVIDER_REGISTRY} from '../../src';

export const APP_SECURITY_PROVIDERS: ProviderDefinition[] = [
  {
    provide: TestController,
    useClass: TestController
  },
  {
    provide: TOKEN_ENCODER,
    useClass: TestTokenEncoder
  },
  {
    provide: AuthListener,
    useClass: AuthListener
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