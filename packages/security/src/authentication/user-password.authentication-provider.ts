import {Injectable} from 'injection-js';
import {BadCredentialsException} from '../exceptions/index';
import {EncoderFactory} from '../password-encoders/encoder-factory';
import {AuthenticationProviderInterface} from '../interfaces';
import {UserProviderManager} from '../user-providers/user-provider-manager';
import {TokenInterface, UserInterface} from '@rxstack/core';
import {UsernameAndPasswordToken} from '../models/username-and-password.token';

@Injectable()
export class UserPasswordAuthenticationProvider implements AuthenticationProviderInterface {

  static readonly PROVIDER_NAME = 'user-password';

  constructor(private userProvider: UserProviderManager,
              private encoderFactory: EncoderFactory) {
  }

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    const user = await this.userProvider.loadUserByUsername(token.getUsername());
    await this.checkAuthentication(user, token);
    token.setUser(user);
    token.setAuthenticated(true);
    token.setFullyAuthenticated(true);
    token.setPayload({
      username: user.username,
      roles: user.roles
    });
    return token;
  }

  getName(): string {
    return UserPasswordAuthenticationProvider.PROVIDER_NAME;
  }

  support(token: TokenInterface): boolean {
    return (token instanceof UsernameAndPasswordToken);
  }

  protected async checkAuthentication(user: UserInterface, token: TokenInterface): Promise<void> {
    const isValid = await this.encoderFactory.getEncoder(user).isPasswordValid(user.password, token.getCredentials());
    if (!isValid) {
      throw new BadCredentialsException('The presented password is invalid.');
    }
  }
}