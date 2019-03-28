import {Injectable} from 'injection-js';
import {TokenManagerInterface} from '@rxstack/security';

@Injectable()
export class MockTokenManager implements TokenManagerInterface {

  async encode(payload: Object): Promise<string> {
    return 'generated-token';
  }

  async decode(token: string): Promise<Object> {
    return {
      'username': 'admin',
      'roles': ['ADMIN']
    };
  }
}