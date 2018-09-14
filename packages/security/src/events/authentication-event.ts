import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {TokenInterface} from '@rxstack/core';

export class AuthenticationEvent extends GenericEvent {
  constructor(public authenticationToken: TokenInterface) {
    super();
  }
}