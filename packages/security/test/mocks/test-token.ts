import {AbstractToken} from '../../src/models/abstract-token';

export class TestToken extends AbstractToken {
  constructor(private test: string) {
    super();
  }

  getUsername(): string {
    return 'unknown';
  }

  getCredentials(): string {
    return this.test;
  }

  getPayload(): Object {
    return {};
  }

  eraseCredentials(): void { }
}