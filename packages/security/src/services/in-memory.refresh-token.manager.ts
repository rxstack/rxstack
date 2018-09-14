import {RefreshTokenInterface, RefreshTokenManagerInterface, TokenManagerInterface} from '../interfaces';
import {RefreshToken} from '../models/refresh-token';
import {Injectable} from 'injection-js';
import {UnauthorizedException} from '@rxstack/exceptions';
import {TokenInterface} from '@rxstack/core';
const md5 = require('crypto-js/md5');
const uuid = require('uuid/v4');

@Injectable()
export class InMemoryRefreshTokenManager implements RefreshTokenManagerInterface {

  private tokens: Map<string, RefreshTokenInterface> = new Map();

  constructor(private tokenManager: TokenManagerInterface,
              private ttl: number) {}

  async count(): Promise<number> {
    return Array.from(this.tokens.values()).filter((token) => token.isValid()).length;
  }

  async has(refreshToken: string): Promise<boolean> {
    return this.tokens.has(refreshToken);
  }

  async get(refreshToken: string): Promise<RefreshTokenInterface> {
    return this.tokens.get(refreshToken);
  }

  async create(authToken: TokenInterface): Promise<RefreshTokenInterface> {
    const token = new RefreshToken(this.generate(), authToken.getUsername(), authToken.getPayload(), this.ttl);
    this.tokens.set(token.token, token);
    return token;
  }

  async disable(refreshToken: RefreshTokenInterface): Promise<void> {
    refreshToken.invalidate();
  }

  async refresh(refreshToken: RefreshTokenInterface): Promise<string> {
    if (!refreshToken.isValid()) {
      throw new UnauthorizedException();
    }
    refreshToken.payload['refreshedAt'] = new Date().getTime();
    return this.tokenManager.encode(refreshToken.payload);
  }

  async clear(): Promise<void> {
    this.tokens.clear();
  }

  private generate(): string {
    return md5(uuid()).toString();
  }
}