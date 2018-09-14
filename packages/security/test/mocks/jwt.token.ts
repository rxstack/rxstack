import {AbstractToken} from '../../src/models/abstract-token';

export class JwtToken extends AbstractToken {
  constructor(private raw: string) {
    super();
  }

  getUsername(): string {
    return this.user ? this.user.username : null;
  }

  getCredentials(): string {
    return this.raw;
  }

  eraseCredentials(): void { }
}