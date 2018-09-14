import {RefreshTokenInterface} from '../interfaces';

export class RefreshToken implements RefreshTokenInterface {

  private validUntil: number;

  constructor(public token: string, public username: string, public payload: Object, ttl: number) {
    this.validUntil = new Date().getTime() + (ttl * 1000);
  }

  isValid(): boolean {
    return this.validUntil > new Date().getTime();
  }

  invalidate(): void {
    this.validUntil = 0;
  }

  toString(): string {
    return this.token;
  }
}