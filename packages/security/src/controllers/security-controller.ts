import {Injectable} from 'injection-js';
import {AuthenticationProviderManager} from '../authentication/authentication-provider-manager';
import {RefreshTokenInterface, TokenManagerInterface} from '../interfaces';
import {Request, Response} from '@rxstack/core';
import {UsernameAndPasswordToken} from '../models/username-and-password.token';
import {ForbiddenException, NotFoundException, UnauthorizedException} from '@rxstack/exceptions';
import {Token} from '../models/token';
import {AnonymousToken} from '../models';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {AuthenticationEvents} from '../authentication-events';
import {AuthenticationRequestEvent} from '../events/authentication-request-event';
import {SecurityConfiguration} from '../security-configuration';
import {AbstractRefreshTokenManager} from '../services';
import {TokenManagerEvents} from '../token-manager-events';
import {TokenPayloadEvent} from '../events';

@Injectable()
export class SecurityController {
  constructor(protected authManager: AuthenticationProviderManager,
              protected tokenManager: TokenManagerInterface,
              protected refreshTokenManager: AbstractRefreshTokenManager,
              protected dispatcher: AsyncEventDispatcher,
              protected configuration: SecurityConfiguration) { }

  async loginAction(request: Request): Promise<Response> {
    const body: any = request.body || {};
    const token = new UsernameAndPasswordToken(body.username, body.password);
    request.token = await this.authManager.authenticate(token);
    await this.dispatcher.dispatch(AuthenticationEvents.LOGIN_SUCCESS, new AuthenticationRequestEvent(request));
    let payload: Record<string, any>;
    this.dispatcher
      .addListener(TokenManagerEvents.TOKEN_CREATED, async (event: TokenPayloadEvent): Promise<void> => {
        payload = event.payload;
      })
    ;
    const rawToken = await this.tokenManager.create(request.token.getUser());
    const refreshToken = await this.refreshTokenManager.create(payload);
    return new Response({'token': rawToken, 'refreshToken': refreshToken._id});
  }

  async logoutAction(request: Request): Promise<Response> {
    const body = request.body || {};
    const refreshToken = await this.findRefreshTokenOr404(body['refreshToken']);
    await this.refreshTokenManager.disable(refreshToken);
    await this.dispatcher.dispatch(AuthenticationEvents.LOGOUT_SUCCESS, new AuthenticationRequestEvent(request));
    return new Response(null, 204);
  }

  async refreshTokenAction(request: Request): Promise<Response> {
    const body = request.body || {};
    const refreshToken = await this.findRefreshTokenOr404(body['refreshToken']);
    const token = await this.refreshTokenManager.refresh(refreshToken);
    await this.dispatcher.dispatch(AuthenticationEvents.REFRESH_TOKEN_SUCCESS, new AuthenticationRequestEvent(request));
    return new Response({'token': token, 'refreshToken': refreshToken._id});
  }

  async authenticateAction(request: Request): Promise<Response> {
    try {
      const token = new Token(request.params.get('bearer'));
      const connection: any = request.connection;
      connection['token'] = await this.authManager.authenticate(token);
      request.token = connection['token'];
      this.setConnectionTimeout(connection);
      await this.dispatcher
        .dispatch(AuthenticationEvents.SOCKET_AUTHENTICATION_SUCCESS, new AuthenticationRequestEvent(request));
      return new Response(null, 204);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async unauthenticateAction(request: Request): Promise<Response> {
    if (!request.token.isAuthenticated()) {
      throw new ForbiddenException();
    }
    await this.dispatcher.dispatch(AuthenticationEvents.SOCKET_UNAUTHENTICATION_SUCCESS, new AuthenticationRequestEvent(request));
    const connection: any = request.connection;
    this.clearConnectionTimeout(connection);
    connection['token'] = new AnonymousToken();
    return new Response(null, 204);
  }

  private async findRefreshTokenOr404(identifier: string): Promise<RefreshTokenInterface> {
    const refreshToken = await this.refreshTokenManager.get(identifier);
    if (!refreshToken) {
      throw new NotFoundException();
    }
    return refreshToken;
  }

  private setConnectionTimeout(connection: any): void {
    this.clearConnectionTimeout(connection);
    const token = connection['token'] as Token;
    if (token) {
      connection['tokenTimeout'] = setTimeout(() => {
        token.setFullyAuthenticated(false);
      }, this.configuration.ttl * 1000);
    }
  }

  private clearConnectionTimeout(connection: any): void {
    if (connection['tokenTimeout']) {
      clearTimeout(connection['tokenTimeout']);
      connection['tokenTimeout'] = null;
    }
  }
}
