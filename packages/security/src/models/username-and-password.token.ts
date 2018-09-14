import {AbstractToken} from './abstract-token';

export class UsernameAndPasswordToken extends AbstractToken {
  constructor(private username: string, private password: string) {
    super();
  }

  getUsername(): string {
    return this.username;
  }

  getCredentials(): string {
    return this.password;
  }

  eraseCredentials(): void {
    this.password = null;
  }
}