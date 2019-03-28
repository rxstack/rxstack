import {RefreshTokenInterface, TokenManagerInterface} from '../interfaces';
import {UnauthorizedException} from '@rxstack/exceptions';
import {TokenInterface} from '@rxstack/core';

const md5 = require('crypto-js/md5');
const uuid = require('uuid/v4');

export abstract class AbstractRefreshTokenManager {

  protected constructor(protected tokenManager: TokenManagerInterface, protected ttl: number) {}

  async createFromAuthToken(authToken: TokenInterface): Promise<RefreshTokenInterface> {
    const data: RefreshTokenInterface = {
      identifier: this.generate(),
      username: authToken.getUsername(),
      payload: authToken.getPayload(),
      expiresAt: new Date().getTime() + (this.ttl * 1000),
    };
    await this.persist(data);
    return data;
  }

  async disable(refreshToken: RefreshTokenInterface): Promise<void> {
    refreshToken.expiresAt = 0;
    await this.persist(refreshToken);
  }

  async refresh(refreshToken: RefreshTokenInterface): Promise<string> {
    if (refreshToken.expiresAt < new Date().getTime()) {
      throw new UnauthorizedException();
    }
    refreshToken.payload['refreshedAt'] = new Date().getTime();
    await this.persist(refreshToken);
    return this.tokenManager.encode(refreshToken.payload);
  }

  abstract persist(data: RefreshTokenInterface): Promise<RefreshTokenInterface>;

  abstract get(identifier: string): Promise<RefreshTokenInterface>;

  abstract clear(): Promise<void>;

  private generate(): string {
    return md5(uuid()).toString();
  }
}