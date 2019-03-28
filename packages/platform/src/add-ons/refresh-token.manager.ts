import {
  RefreshTokenInterface,
  TokenManagerInterface,
  AbstractRefreshTokenManager
} from '@rxstack/security';
import {Injectable} from 'injection-js';
import {ServiceInterface} from '../interfaces';

@Injectable()
export class RefreshTokenManager<T extends RefreshTokenInterface> extends AbstractRefreshTokenManager {

  constructor(
    private service: ServiceInterface<T>,
    tokenManager: TokenManagerInterface,
    ttl: number
  ) {
    super(tokenManager, ttl);
  }

  async persist(data: RefreshTokenInterface): Promise<T> {
    const result = await this.get(data.identifier);
    if (result) {
      await this.service.updateOne(data[this.service.options.idField], data);
      return await this.get(data.identifier);
    } else {
      return await this.service.insertOne(data);
    }
  }

  async get(identifier: string): Promise<T> {
    return await this.service.findOne({'identifier': {'$eq': identifier}});
  }

  async clear(): Promise<void> {
    await this.service.removeMany({});
  }
}