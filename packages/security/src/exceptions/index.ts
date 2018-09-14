import {Exception, UnauthorizedException} from '@rxstack/exceptions';
import {TokenInterface} from '@rxstack/core';

export class AuthenticationException extends UnauthorizedException {
  token: TokenInterface;
  constructor(message = 'Authentication Exception' ) {
    super(message);
  }
}

export class BadCredentialsException extends AuthenticationException {
  constructor(message = 'Bad Credentials') {
    super(message);
  }
}

export class UserNotFoundException extends AuthenticationException {
  constructor(public readonly username: string) {
    super('Username or password is not found');
  }
}

export class ProviderNotFoundException extends UnauthorizedException {
  constructor(message = 'No authentication provider found to support the authentication token.') {
    super(message);
  }
}

export class JWTEncodeFailureException extends Exception {
  constructor(message: string, public prevMessage?: string) {
    super(message);
  }
}

export class JWTDecodeFailureException extends Exception {
  constructor(message: string, public prevMessage?: string) {
    super(message);
  }
}
