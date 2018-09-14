import {AuthenticationEvent} from './authentication-event';
import {TokenInterface} from '@rxstack/core';

export class AuthenticationFailureEvent extends AuthenticationEvent {
  constructor(public readonly authenticationToken: TokenInterface,
              public readonly lastException: any) {
    super(authenticationToken);
  }
}