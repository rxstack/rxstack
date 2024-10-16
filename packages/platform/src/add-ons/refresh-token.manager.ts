import {
  RefreshTokenInterface,
  AbstractRefreshTokenManager, TokenEncoderInterface
} from '@rxstack/security';
import {Injectable} from 'injection-js';
import {ServiceInterface} from '../interfaces';

@Injectable()
export class RefreshTokenManager<T extends RefreshTokenInterface> extends AbstractRefreshTokenManager {

  constructor(
    private service: ServiceInterface<T>,
    tokenEncoder: TokenEncoderInterface,
    ttl: number
  ) {
    super(tokenEncoder, ttl);
  }

  async persist(data: RefreshTokenInterface): Promise<T> {
    const result = await this.get(data._id);
    if (result) {
      // @ts-ignore
      await this.service.updateOne(data[this.service.options.idField], data);
      return await this.get(data._id);
    } else {
      return await this.service.insertOne(data);
    }
  }

  async get(identifier: string): Promise<T> {
    return await this.service.find(identifier);
  }

  async clear(): Promise<void> {
    await this.service.removeMany({});
  }
}
