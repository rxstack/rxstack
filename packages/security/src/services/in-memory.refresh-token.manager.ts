import {RefreshTokenInterface, TokenEncoderInterface} from '../interfaces';
import {Injectable} from 'injection-js';
import {AbstractRefreshTokenManager} from './abstract-refresh-token.manager';

@Injectable()
export class InMemoryRefreshTokenManager extends AbstractRefreshTokenManager {

  private tokens: Map<string, RefreshTokenInterface> = new Map();

  constructor(tokenManager: TokenEncoderInterface, ttl: number) {
    super(tokenManager, ttl);
  }

  async persist(refreshToken: RefreshTokenInterface): Promise<RefreshTokenInterface> {
    this.tokens.set(refreshToken.identifier, refreshToken);
    return refreshToken;
  }

  async get(identifier: string): Promise<RefreshTokenInterface> {
    return this.tokens.get(identifier);
  }

  async clear(): Promise<void> {
    this.tokens.clear();
  }
}