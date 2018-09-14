import {Injectable} from 'injection-js';
import {AuthenticationProviderManager} from '../authentication/authentication-provider-manager';
import {RefreshTokenInterface, RefreshTokenManagerInterface, TokenManagerInterface} from '../interfaces';
import {Request, Response} from '@rxstack/core';
import {UsernameAndPasswordToken} from '../models/username-and-password.token';
import {NotFoundException, UnauthorizedException} from '@rxstack/exceptions';
import {Token} from '../models/token';
import {AnonymousToken} from '../models';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {AuthenticationEvents} from '../authentication-events';
import {AuthenticationRequestEvent} from '../events/authentication-request-event';
import {EventEmitter} from 'events';
import {SecurityConfiguration} from '../security-configuration';

@Injectable()
export class SecurityController {
  constructor(protected authManager: AuthenticationProviderManager,
              protected tokenManager: TokenManagerInterface,
              protected refreshTokenManager: RefreshTokenManagerInterface,
              protected dispatcher: AsyncEventDispatcher,
              protected configuration: SecurityConfiguration) { }

  async loginAction(request: Request): Promise<Response> {
    const token = new UsernameAndPasswordToken(request.params.get('username'), request.params.get('password'));
    request.token = await this.authManager.authenticate(token);
    await this.dispatcher.dispatch(AuthenticationEvents.LOGIN_SUCCESS, new AuthenticationRequestEvent(request));
    const rawToken = await this.tokenManager.encode(request.token.getPayload());
    const refreshToken = await this.refreshTokenManager.create(request.token);
    return new Response({'token': rawToken, 'refreshToken': refreshToken.toString()});
  }

  async logoutAction(request: Request): Promise<Response> {
    const refreshToken = await this.findRefreshTokenOr404(request.params.get('refreshToken'));
    await this.refreshTokenManager.disable(refreshToken);
    await this.dispatcher.dispatch(AuthenticationEvents.LOGOUT_SUCCESS, new AuthenticationRequestEvent(request));
    return new Response(null, 204);
  }

  async refreshTokenAction(request: Request): Promise<Response> {
    const refreshToken = await this.findRefreshTokenOr404(request.params.get('refreshToken'));
    const token = await this.refreshTokenManager.refresh(refreshToken);
    await this.dispatcher.dispatch(AuthenticationEvents.REFRESH_TOKEN_SUCCESS, new AuthenticationRequestEvent(request));
    return new Response({'token': token, 'refreshToken': refreshToken.toString()});
  }

  async authenticateAction(request: Request): Promise<Response> {
    try {
      const token = new Token(request.params.get('bearer'));
      request.connection['token'] = await this.authManager.authenticate(token);
      request.token = request.connection['token'];
      this.setConnectionTimeout(request.connection);
      await this.dispatcher
        .dispatch(AuthenticationEvents.SOCKET_AUTHENTICATION_SUCCESS, new AuthenticationRequestEvent(request));
      return new Response(null, 204);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async unauthenticateAction(request: Request): Promise<Response> {
    await this.dispatcher.dispatch(AuthenticationEvents.SOCKET_UNAUTHENTICATION_SUCCESS, new AuthenticationRequestEvent(request));
    this.clearConnectionTimeout(request.connection);
    request.connection['token'] = new AnonymousToken();
    return new Response(null, 204);
  }

  private async findRefreshTokenOr404(token: string): Promise<RefreshTokenInterface> {
    const refreshToken = await this.refreshTokenManager.get(token);
    if (!refreshToken) {
      throw new NotFoundException();
    }
    return refreshToken;
  }

  private setConnectionTimeout(connection: EventEmitter): void {
    this.clearConnectionTimeout(connection);
    const token = connection['token'];
    if (token) {
      connection['tokenTimeout'] = setTimeout(() => {
        token.setFullyAuthenticated(false);
      }, this.configuration.ttl);
    }
  }

  private clearConnectionTimeout(connection: EventEmitter): void {
    if (connection['tokenTimeout']) {
      clearTimeout(connection['tokenTimeout']);
      connection['tokenTimeout'] = null;
    }
  }
}