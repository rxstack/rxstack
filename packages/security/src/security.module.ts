import {Module, ModuleWithProviders, ProviderDefinition} from '@rxstack/core';
import {SecurityConfiguration} from './security-configuration';
import {InjectionToken} from 'injection-js';
import {
  AuthenticationProviderInterface, PasswordEncoderInterface, TokenExtractorInterface,
  TokenManagerInterface,
  UserProviderInterface
} from './interfaces';
import {BcryptPasswordEncoder} from './password-encoders/bcrypt.password-encoder';
import {EncoderFactory} from './password-encoders/encoder-factory';
import {UserProviderManager} from './user-providers/user-provider-manager';
import {NoopUserProvider} from './user-providers/noop-user-provider';
import {AuthenticationProviderManager} from './authentication/authentication-provider-manager';
import {UserPasswordAuthenticationProvider} from './authentication/user-password.authentication-provider';
import {TokenExtractorManager} from './token-extractors/token-extractor-manager';
import {QueryParameterTokenExtractor} from './token-extractors/query-parameter-token-extractor';
import {HeaderTokenExtractor} from './token-extractors/header-token-extractor';
import {TokenExtractorListener} from './event-listeners/token-extractor-listener';
import {AuthenticationTokenListener} from './event-listeners/authentication-token-listener';
import {InMemoryRefreshTokenManager} from './services/in-memory.refresh-token.manager';
import { BootstrapListener } from './event-listeners/bootstrap-listener';
import {SecurityController} from './controllers/security-controller';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {TokenAuthenticationProvider} from './authentication/token.authentication-provider';
import {ConnectionListener} from './event-listeners/connection-listener';
import {AbstractRefreshTokenManager, KeyLoader, TokenManager} from './services';
import {PlainTextPasswordEncoder} from './password-encoders';

export const AUTH_PROVIDER_REGISTRY = new InjectionToken<AuthenticationProviderInterface[]>('AUTH_PROVIDER_REGISTRY');
export const USER_PROVIDER_REGISTRY = new InjectionToken<UserProviderInterface[]>('USER_PROVIDER_REGISTRY');
export const PASSWORD_ENCODER_REGISTRY = new InjectionToken<PasswordEncoderInterface[]>('PASSWORD_ENCODER_REGISTRY');
export const TOKEN_EXTRACTOR_REGISTRY = new InjectionToken<TokenExtractorInterface[]>('TOKEN_EXTRACTOR_REGISTRY');
export const TOKEN_MANAGER = new InjectionToken<TokenManagerInterface>('TOKEN_MANAGER');
export const REFRESH_TOKEN_MANAGER = new InjectionToken<AbstractRefreshTokenManager>('REFRESH_TOKEN_MANAGER');

@Module()
export class SecurityModule {
  static configure(configuration: SecurityConfiguration): ModuleWithProviders {
    return {
      module: SecurityModule,
      providers: [
        {
          provide: SecurityConfiguration,
          useFactory: () => {
            return new SecurityConfiguration(configuration);
          },
          deps: []
        },
        ...this.addCommonProviders(),
        ...this.addEncoderRelatedProviders(),
        ...this.addLocalAuthenticationProviders(),
        ...this.addUserRelatedProviders(),
        ...this.addAuthenticationRelatedProviders(),
        ...this.addTokenExtractorRelatedProviders(),
      ],
    };
  }

  private static addCommonProviders(): ProviderDefinition[] {
    return [
      { provide: KeyLoader, useClass: KeyLoader },
      { provide: TOKEN_MANAGER,  useClass: TokenManager },
    ];
  }

  private static addEncoderRelatedProviders(): ProviderDefinition[] {
    return [
      {
        provide: EncoderFactory,
        useFactory: (registry: PasswordEncoderInterface[]) => {
          return new EncoderFactory(registry);
        },
        deps: [PASSWORD_ENCODER_REGISTRY]
      },
      { provide: PASSWORD_ENCODER_REGISTRY, useClass: BcryptPasswordEncoder, multi: true },
      { provide: PASSWORD_ENCODER_REGISTRY, useClass: PlainTextPasswordEncoder, multi: true },
    ];
  }

  private static addLocalAuthenticationProviders(): ProviderDefinition[] {
    return [
      {
        provide: SecurityController,
        useFactory: (authManager: AuthenticationProviderManager,
                     tokenManager: TokenManagerInterface,
                     refreshTokenManager: AbstractRefreshTokenManager,
                     dispatcher: AsyncEventDispatcher,
                     configuration: SecurityConfiguration
        ) => {
          return new SecurityController(authManager, tokenManager, refreshTokenManager, dispatcher, configuration);
        },
        deps: [
          AuthenticationProviderManager, TOKEN_MANAGER, REFRESH_TOKEN_MANAGER, AsyncEventDispatcher, SecurityConfiguration
        ]
      },
      {
        provide: REFRESH_TOKEN_MANAGER,
        useFactory: (tokenManager: TokenManagerInterface, config: SecurityConfiguration) => {
          return new InMemoryRefreshTokenManager(tokenManager, config.refresh_token_ttl);
        },
        deps: [TOKEN_MANAGER, SecurityConfiguration]
      },
      { provide: BootstrapListener, useClass: BootstrapListener },
      { provide: ConnectionListener, useClass: ConnectionListener },
    ];
  }

  private static addUserRelatedProviders(): ProviderDefinition[] {
    return [
      {
        provide: UserProviderManager,
        useFactory: (registry: UserProviderInterface[]) => {
          return new UserProviderManager(registry);
        },
        deps: [USER_PROVIDER_REGISTRY]
      },
      { provide: USER_PROVIDER_REGISTRY, useClass: NoopUserProvider, multi: true },
    ];
  }

  private static addTokenExtractorRelatedProviders(): ProviderDefinition[] {
    return [
      {
        provide: TokenExtractorManager,
        useFactory: (registry: TokenExtractorInterface[]) => {
          return new TokenExtractorManager(registry);
        },
        deps: [TOKEN_EXTRACTOR_REGISTRY]
      },
      { provide: TOKEN_EXTRACTOR_REGISTRY, useClass: QueryParameterTokenExtractor, multi: true },
      { provide: TOKEN_EXTRACTOR_REGISTRY, useClass: HeaderTokenExtractor, multi: true },
      { provide: TokenExtractorListener, useClass: TokenExtractorListener },
    ];
  }

  private static addAuthenticationRelatedProviders(): ProviderDefinition[] {
    return [
      {
        provide: AuthenticationProviderManager,
        useFactory: (registry: AuthenticationProviderInterface[],
                     eventDispatcher: AsyncEventDispatcher) => {
          return new AuthenticationProviderManager(registry, eventDispatcher);
        },
        deps: [AUTH_PROVIDER_REGISTRY, AsyncEventDispatcher]
      },
      {
        provide: AUTH_PROVIDER_REGISTRY,
        useFactory: (userProvider: UserProviderManager,
                     tokenManager: TokenManagerInterface,
                     config: SecurityConfiguration) => {
          return new TokenAuthenticationProvider(userProvider, tokenManager, config);
        },
        deps: [UserProviderManager, TOKEN_MANAGER, SecurityConfiguration],
        multi: true
      },
      { provide: AUTH_PROVIDER_REGISTRY, useClass: UserPasswordAuthenticationProvider, multi: true },
      { provide: AuthenticationTokenListener, useClass: AuthenticationTokenListener },
    ];
  }
}
