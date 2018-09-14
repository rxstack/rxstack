import {TokenManagerInterface} from '../../src/interfaces';
import {Injectable} from 'injection-js';

@Injectable()
export class TestTokenManager implements TokenManagerInterface {

  async encode(payload: Object): Promise<string> {
    return 'generated-token';
  }

  async decode(token: string): Promise<Object> {
    if (token === 'generated-token') {
      return {
        'username': 'admin',
        'roles': ['ADMIN']
      };
    }

    if (token === 'no-username') {
      return {
        'nousername': 'none',
        'roles': ['ADMIN']
      };
    }

    if (token === 'invalid') {
      throw new Error('Invalid token');
    }

    return null;
  }
}