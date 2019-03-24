import {AbstractToken} from './abstract-token';

export class AnonymousToken extends AbstractToken {

  getUsername(): string {
    return 'anon';
  }

  getCredentials(): string {
    return null;
  }

  eraseCredentials(): void { }
}