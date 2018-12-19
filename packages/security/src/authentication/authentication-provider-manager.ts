import {AuthenticationException, ProviderNotFoundException} from '../exceptions/index';
import {AuthenticationEvent} from '../events/authentication-event';
import {AuthenticationFailureEvent} from '../events/authentication-failure-event';
import {AuthenticationEvents} from '../authentication-events';
import {Injectable} from 'injection-js';
import {AuthenticationProviderInterface} from '../interfaces';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {TokenInterface} from '@rxstack/core';
import {ServiceRegistry} from '@rxstack/service-registry';

@Injectable()
export class AuthenticationProviderManager extends ServiceRegistry<AuthenticationProviderInterface> {

  constructor(registry: AuthenticationProviderInterface[], private eventDispatcher: AsyncEventDispatcher) {
    super(registry);
  }

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    let authToken: TokenInterface;
    try {
      authToken = await this.doAuthenticate(token);
    } catch (e) {
      if (e instanceof AuthenticationException) {
        const authenticationFailureEvent = new AuthenticationFailureEvent(token, e);
        await this.eventDispatcher
          .dispatch(AuthenticationEvents.AUTHENTICATION_FAILURE, authenticationFailureEvent);
        throw authenticationFailureEvent.lastException;
      }
      throw e;
    }
    if (authToken) {
      authToken.eraseCredentials();
      const authenticationEvent = new AuthenticationEvent(authToken);
      await this.eventDispatcher.dispatch(
        AuthenticationEvents.AUTHENTICATION_SUCCESS, authenticationEvent
      );
      return authenticationEvent.authenticationToken;
    }
    throw new ProviderNotFoundException();
  }

  private async doAuthenticate(token: TokenInterface): Promise<TokenInterface> {
    for (let i = 0; i < this.all().length; i++) {
      const provider = this.all()[i];
      if (provider.support(token)) {
        return await provider.authenticate(token);
      }
    }
  }
}