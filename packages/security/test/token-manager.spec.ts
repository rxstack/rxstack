import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {
  JWTDecodeFailureException,
  Token,
  TOKEN_MANAGER, TokenDecodedEvent,
  TokenEncodedEvent,
  TokenManagerEvents,
  TokenManagerInterface,
  TokenPayloadEvent
} from '../src';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';

describe('TokenManager', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector = null;
  let manager: TokenManagerInterface;
  let dispatcher: AsyncEventDispatcher;

  beforeAll(async() =>  {
    injector = await app.run();
    manager = injector.get(TOKEN_MANAGER);
    dispatcher = injector.get(AsyncEventDispatcher);
  });

  it('should create and decode token', async () => {
    const encoded = await manager.create({username: 'admin', roles: ['ROLE_ADMIN']});
    const decoded = await manager.decode(new Token(encoded));
    expect(decoded.hasOwnProperty('username')).toBeTruthy();
    expect(decoded.hasOwnProperty('roles')).toBeTruthy();
  });

  it('should dispatch security.token.created and security.token.encoded', async () => {
    let dispatchedCreated = false;
    let dispatchedEncoded = false;

    dispatcher.addListener(TokenManagerEvents.TOKEN_CREATED, async (event: TokenPayloadEvent): Promise<void> => {
      dispatchedCreated = true;
    });
    dispatcher.addListener(TokenManagerEvents.TOKEN_ENCODED, async (event: TokenEncodedEvent): Promise<void> => {
      dispatchedEncoded = true;
    });
    await manager.create({username: 'admin', roles: ['ROLE_ADMIN']});
    expect(dispatchedCreated).toBeTruthy();
    expect(dispatchedEncoded).toBeTruthy();
    dispatcher.removeListeners(TokenManagerEvents.TOKEN_CREATED);
    dispatcher.removeListeners(TokenManagerEvents.TOKEN_ENCODED);
  });

  it('should dispatch security.token.decoded', async () => {
    let dispatchedDecoded = false;

    dispatcher.addListener(TokenManagerEvents.TOKEN_DECODED, async (event: TokenDecodedEvent): Promise<void> => {
      event.markAsInvalid();
    });
    const encoded = await manager.create({username: 'admin', roles: ['ROLE_ADMIN']});
    let exception: JWTDecodeFailureException;
    try {
      await manager.decode(new Token(encoded));
    } catch (e) {
      exception = e;
    }
    expect(exception).toBeInstanceOf(JWTDecodeFailureException);
    dispatcher.removeListeners(TokenManagerEvents.TOKEN_DECODED);
  });
});
