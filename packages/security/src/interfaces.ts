import {Request, TokenInterface, UserInterface} from '@rxstack/core';
import {NamedServiceInterface} from '@rxstack/service-registry';

export type UserFactoryFunc<T extends UserInterface> = (data: UserInterface) => T;

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
  token: string;
  username: string;
  payload: Object;
  isValid(): boolean;
  invalidate(): void;
  toString(): string;
}

export interface RefreshTokenManagerInterface {
  count(): Promise<number>;
  create(authToken: TokenInterface): Promise<RefreshTokenInterface>;
  has(refreshToken: string): Promise<boolean>;
  get(refreshToken: string): Promise<RefreshTokenInterface>;
  disable(refreshToken: RefreshTokenInterface): Promise<void>;
  refresh(refreshToken: RefreshTokenInterface): Promise<string>;
  clear(): Promise<void>;
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
