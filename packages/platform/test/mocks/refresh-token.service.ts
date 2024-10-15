import {Injectable} from 'injection-js';
import {ServiceInterface, ServiceOptions} from '../../src';
import {QueryInterface} from '@rxstack/query-filter';
import {RefreshTokenInterface} from '@rxstack/security';

@Injectable()
export class RefreshTokenService implements ServiceInterface<RefreshTokenInterface> {

  static data: RefreshTokenInterface[] = [
    { '_id': 'id-1', 'payload': {}, expiresAt: new Date().getTime() + 1000000}
  ];

  options: ServiceOptions = { idField: 'identifier', defaultLimit: 25 };

  async insertOne(data: Object): Promise<RefreshTokenInterface> {
    return data as RefreshTokenInterface;
  }

  async insertMany(data: Object[]): Promise<RefreshTokenInterface[]> {
    return data as RefreshTokenInterface[];
  }

  async updateOne(id: any, data: Object): Promise<void> { }

  async updateMany(criteria: Object, data: Object): Promise<number> {
    return 1;
  }

  async removeOne(id: any): Promise<void> { }

  async removeMany(criteria: Object): Promise<number> {
    return 1;
  }

  async count(criteria?: Object): Promise<number> {
    return 0;
  }

  async find(id: any): Promise<RefreshTokenInterface> {
    return null;
  }

  async findOne(criteria: Object): Promise<RefreshTokenInterface> {
    // @ts-ignore
    const id = criteria['identifier']['$eq'];
    switch (id) {
      case 'id-1':
        return RefreshTokenService.data[0];
      default:
        return null;
    }
  }

  async findMany(query?: QueryInterface): Promise<RefreshTokenInterface[]> {
    return [];
  }
}
