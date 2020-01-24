import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {User} from '../models';

export class TokenEncodedEvent extends GenericEvent {
  constructor(public rawToken: string, public readonly user: User) {
    super();
  }
}