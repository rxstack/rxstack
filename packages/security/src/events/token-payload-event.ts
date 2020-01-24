import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {User} from '../models';

export class TokenPayloadEvent extends GenericEvent {
  constructor(public payload: object, public readonly user: User) {
    super();
  }
}