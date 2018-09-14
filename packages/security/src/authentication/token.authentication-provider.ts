import {Injectable} from 'injection-js';
import {BadCredentialsException} from '../exceptions/index';
import {AuthenticationProviderInterface, TokenManagerInterface} from '../interfaces';
import {UserProviderManager} from '../user-providers/user-provider-manager';
import {TokenInterface, UserInterface} from '@rxstack/core';
import {SecurityConfiguration} from '../security-configuration';
import {Token} from '../models';

@Injectable()
export class TokenAuthenticationProvider implements AuthenticationProviderInterface {

  static readonly PROVIDER_NAME = 'token';

  constructor(private userProvider: UserProviderManager, private tokenManager: TokenManagerInterface,
              private config: SecurityConfiguration) {
  }

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    const payload = await this.getPayload(token);
    const user = await this.getUserFromPayload(payload);
    token.setPayload(payload);
    token.setUser(user);
    token.setAuthenticated(true);
    const isFullyAuthenticated = payload['refreshedAt'] ? false : true;
    token.setFullyAuthenticated(isFullyAuthenticated);
    return token;
  }

  getName(): string {
    return TokenAuthenticationProvider.PROVIDER_NAME;
  }

  support(token: TokenInterface): boolean {
    return (token instanceof Token);
  }

  private async getPayload(token: TokenInterface): Promise<Object> {
    let payload: Object;
    try {
      payload = await this.tokenManager.decode(token.getCredentials());
    } catch (e) {
      throw new BadCredentialsException('Invalid token.');
    }
    return payload;
  }

  private async getUserFromPayload(payload: Object): Promise<UserInterface> {
    if (!payload || !payload[this.config.user_identity_field]) {
      throw new BadCredentialsException('Identity field is not in the payload.');
    }
    return this.userProvider.loadUserByUsername(payload[this.config.user_identity_field], payload);
  }
}