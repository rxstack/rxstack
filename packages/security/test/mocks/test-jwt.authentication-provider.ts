import {Injectable} from 'injection-js';
import {AuthenticationProviderInterface} from '../../src/interfaces';
import {User} from '../../src/models/user';
import {Token} from '../../src/models/token';
import {BadCredentialsException} from '../../src/exceptions/index';
import {TokenInterface} from '@rxstack/core';

@Injectable()
export class TestJwtAuthenticationProvider implements AuthenticationProviderInterface {

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    if (token.getCredentials() !== 'generated-token') {
      throw new BadCredentialsException('The presented password is invalid.');
    }
    token.setUser(new User('admin', 'admin', ['ADMIN']));
    token.setAuthenticated(true);
    token.setFullyAuthenticated(false);
    return token;
  }

  getName(): string {
    return 'jwt_test';
  }

  support(token: TokenInterface): boolean {
    if (token instanceof Token)
      return true;
    else
      return false;
  }
}