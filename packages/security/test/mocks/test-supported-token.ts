import {AbstractToken} from '../../src/models/abstract-token';

export class TestSupportedToken extends AbstractToken {

  getUsername(): string {
    return 'unknown';
  }

  getCredentials(): string {
    return 'unknown';
  }

  eraseCredentials(): void { }
}