import {AuthenticationEvent} from '../../src/events/authentication-event';
import {AuthenticationFailureEvent} from '../../src/events/authentication-failure-event';
import {Observe} from '@rxstack/async-event-dispatcher';
import {AuthenticationEvents} from '../../src/authentication-events';
import {Injectable} from 'injection-js';

@Injectable()
export class AuthListener {

  successCalled = false;
  failureCalled = false;

  @Observe(AuthenticationEvents.AUTHENTICATION_SUCCESS)
  async onAuthenticationSuccess(event: AuthenticationEvent): Promise<void> {
    this.successCalled = true;
  }

  @Observe(AuthenticationEvents.AUTHENTICATION_FAILURE)
  async onAuthenticationFailure(event: AuthenticationFailureEvent): Promise<void> {
    this.failureCalled = true;
  }
}