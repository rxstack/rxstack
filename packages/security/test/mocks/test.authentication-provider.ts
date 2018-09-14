import {Injectable} from 'injection-js';
import {AuthenticationProviderInterface} from '../../src/interfaces';
import {Exception} from '@rxstack/exceptions';
import {TestSupportedToken} from './test-supported-token';
import {TokenInterface} from '@rxstack/core';

export class TestAuthenticationProviderException extends Exception {}

@Injectable()
export class TestAuthenticationProvider implements AuthenticationProviderInterface {

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    throw new TestAuthenticationProviderException('test');
  }

  getName(): string {
    return 'test';
  }

  support(token: TokenInterface): boolean {
    if (token instanceof TestSupportedToken)
      return true;
    else
      return false;
  }
}