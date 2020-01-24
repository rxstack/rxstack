import {Module, ModuleWithProviders, ProviderDefinition} from '@rxstack/core';
import {SecretConfiguration, SecurityConfiguration} from './security-configuration';
import {
  AUTH_PROVIDER_REGISTRY,
  AuthenticationProviderInterface,
  PASSWORD_ENCODER_REGISTRY,
  PasswordEncoderInterface,
  REFRESH_TOKEN_MANAGER,
  SECRET_MANAGER,
  TOKEN_ENCODER,
  TOKEN_EXTRACTOR_REGISTRY,
  TOKEN_MANAGER, TokenEncoderInterface,
  TokenExtractorInterface,
  TokenManagerInterface,
  USER_PROVIDER_REGISTRY,
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
import {AbstractRefreshTokenManager, SecretLoader, TokenEncoder} from './services';
import {PlainTextPasswordEncoder} from './password-encoders';
import {ServiceRegistry} from '@rxstack/service-registry';
import {TokenManager} from './services/token-manager';


@Module()
export class SecurityModule {
  static configure(configuration: SecurityConfiguration): ModuleWithProviders {
    return {
      module: SecurityModule,
      providers: [
        {
          provide: SecurityConfiguration,
          useFactory: () => new SecurityConfiguration(configuration),
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
      {
        provide: SECRET_MANAGER,
        useFactory: (configuration: SecurityConfiguration) => {
          const service = new ServiceRegistry<SecretLoader>();
          configuration.secret_configurations
            .forEach((secret: SecretConfiguration) => service.register(new SecretLoader(secret)))
          ;
          return service;
        },
        deps: [SecurityConfiguration]
      },
      {
        provide: TOKEN_ENCODER,
        useFactory: (secretManager: ServiceRegistry<SecretLoader>, configuration: SecurityConfiguration) => {
          return new TokenEncoder(secretManager, configuration);
        },
        deps: [SECRET_MANAGER, SecurityConfiguration]
      },
      {
        provide: TOKEN_MANAGER,
        useFactory: (tokenEncoder: TokenEncoder, eventDispatcher: AsyncEventDispatcher,
                     configuration: SecurityConfiguration) => {
          return new TokenManager(tokenEncoder, eventDispatcher, configuration);
        },
        deps: [TOKEN_ENCODER, AsyncEventDispatcher, SecurityConfiguration]
      },
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
        useFactory: (tokenEncoder: TokenEncoderInterface, config: SecurityConfiguration) => {
          return new InMemoryRefreshTokenManager(tokenEncoder, config.refresh_token_ttl);
        },
        deps: [TOKEN_ENCODER, SecurityConfiguration]
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
