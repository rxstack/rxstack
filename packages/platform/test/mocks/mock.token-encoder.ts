import {Injectable} from 'injection-js';
import {TokenEncoderInterface} from '@rxstack/security';

@Injectable()
export class MockTokenEncoder implements TokenEncoderInterface {

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