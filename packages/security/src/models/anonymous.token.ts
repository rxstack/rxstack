import {AbstractToken} from './abstract-token';

export class AnonymousToken extends AbstractToken {

  constructor() {
    super();
    this.eraseCredentials();
  }

  getUsername(): string {
    return 'anon';
  }

  getCredentials(): string {
    return null;
  }

  eraseCredentials(): void { }
}