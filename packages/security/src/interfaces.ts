import {Request, TokenInterface, UserInterface} from '@rxstack/core';
import {NamedServiceInterface, ServiceRegistry} from '@rxstack/service-registry';
import {InjectionToken} from 'injection-js';
import {AbstractRefreshTokenManager, SecretLoader} from './services';

export const AUTH_PROVIDER_REGISTRY = new InjectionToken<AuthenticationProviderInterface[]>('AUTH_PROVIDER_REGISTRY');
export const USER_PROVIDER_REGISTRY = new InjectionToken<UserProviderInterface[]>('USER_PROVIDER_REGISTRY');
export const PASSWORD_ENCODER_REGISTRY = new InjectionToken<PasswordEncoderInterface[]>('PASSWORD_ENCODER_REGISTRY');
export const TOKEN_EXTRACTOR_REGISTRY = new InjectionToken<TokenExtractorInterface[]>('TOKEN_EXTRACTOR_REGISTRY');
export const TOKEN_MANAGER = new InjectionToken<TokenManagerInterface>('TOKEN_MANAGER');
export const REFRESH_TOKEN_MANAGER = new InjectionToken<AbstractRefreshTokenManager>('REFRESH_TOKEN_MANAGER');
export const SECRET_MANAGER = new InjectionToken<ServiceRegistry<SecretLoader>>('SECRET_MANAGER');

export type UserFactoryFunc<T extends UserInterface> = (data: any) => T;

export interface AuthenticationProviderInterface extends NamedServiceInterface {
  authenticate(token: TokenInterface): Promise<TokenInterface>;
  support(token: TokenInterface): boolean;
}

export interface UserProviderInterface extends NamedServiceInterface {
  loadUserByUsername(username: string, payload?: any): Promise<UserInterface>;
}

export interface PasswordEncoderInterface extends NamedServiceInterface {
  encodePassword(raw: string): Promise<string>;
  isPasswordValid(encoded: string, raw: string): Promise<boolean>;
}

export interface EncoderAwareInterface {
  getEncoderName(): string;
}

export interface TokenManagerInterface {
  encode(payload: Object): Promise<string>;
  decode(token: string): Promise<Object>;
}

export interface RefreshTokenInterface {
  identifier: string;
  username: string;
  payload: Object;
  expiresAt: number;
}

export interface TokenExtractorInterface extends NamedServiceInterface {
  extract(request: Request): string;
}

export interface Secret {
  key: string | Buffer;
  passphrase?: string;
}

export enum KeyType {
  PUBLIC_KEY = 'public_key',
  PRIVATE_KEY = 'private_key'
}
