import {GenericEvent} from '@rxstack/async-event-dispatcher';

export class TokenDecodedEvent extends GenericEvent {

  private valid = true;

  constructor(public payload: object) {
    super();
  }

  markAsInvalid(): void {
    this.valid = false;
    this.stopPropagation();
  }

  isValid(): boolean {
    return this.valid;
  }
}