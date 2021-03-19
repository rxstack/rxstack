import {RefreshTokenInterface, TokenEncoderInterface} from '../interfaces';
import {UnauthorizedException} from '@rxstack/exceptions';

const md5 = require('crypto-js/md5');
const { v4: uuidv4 } = require('uuid');

export abstract class AbstractRefreshTokenManager {

  protected constructor(protected tokenEncoder: TokenEncoderInterface, protected ttl: number) {}

  async create(payload: Object): Promise<RefreshTokenInterface> {
    const data: RefreshTokenInterface = {
      _id: md5(uuidv4()).toString(),
      payload: Object.assign({}, payload, {refreshed: true}),
      expiresAt: new Date().getTime() + (this.ttl * 1000),
    };
    return await this.persist(data);
  }

  async disable(refreshToken: RefreshTokenInterface): Promise<void> {
    refreshToken.expiresAt = 0;
    await this.persist(refreshToken);
  }

  async refresh(refreshToken: RefreshTokenInterface): Promise<string> {
    if (refreshToken.expiresAt < new Date().getTime()) {
      throw new UnauthorizedException();
    }
    return await this.tokenEncoder.encode(refreshToken.payload);
  }

  abstract persist(data: RefreshTokenInterface): Promise<RefreshTokenInterface>;

  abstract get(identifier: string): Promise<RefreshTokenInterface>;

  abstract clear(): Promise<void>;
}
