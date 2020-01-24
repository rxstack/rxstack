import {Injectable} from 'injection-js';
import {TokenEncoderInterface, TokenManagerInterface} from '../interfaces';
import {SecurityConfiguration} from '../security-configuration';
import {User} from '../models';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {TokenDecodedEvent, TokenEncodedEvent, TokenPayloadEvent} from '../events';
import {TokenManagerEvents} from '../token-manager-events';
import {TokenInterface} from '@rxstack/core';
import {JWTDecodeFailureException} from '../exceptions';


@Injectable()
export class TokenManager implements TokenManagerInterface {

  constructor(private tokenEncoder: TokenEncoderInterface, private eventDispatcher: AsyncEventDispatcher,
              private config: SecurityConfiguration) { }

  async create(user: User): Promise<string> {
    const payload = {
     [this.config.user_identity_field]: user[this.config.user_identity_field],
      roles: user.roles
    };
    const tokenEvent = new TokenPayloadEvent(payload, user);
    await this.eventDispatcher.dispatch(TokenManagerEvents.TOKEN_CREATED, tokenEvent);
    const encoded = await this.tokenEncoder.encode(tokenEvent.payload);
    const tokenEncodedEvent = new TokenEncodedEvent(encoded, user);
    await this.eventDispatcher.dispatch(TokenManagerEvents.TOKEN_ENCODED, tokenEncodedEvent);
    return tokenEncodedEvent.rawToken;
  }

  async decode(token: TokenInterface): Promise<Object> {
    const payload = await this.tokenEncoder.decode(token.getCredentials());
    const decodedEvent = new TokenDecodedEvent(payload);
    await this.eventDispatcher.dispatch(TokenManagerEvents.TOKEN_DECODED, decodedEvent);
    if (!decodedEvent.isValid()) {
      throw new JWTDecodeFailureException('Invalid JWT Token');
    }
    return decodedEvent.payload;
  }
}