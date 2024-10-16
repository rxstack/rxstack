import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Injector} from 'injection-js';
import {EncoderFactory} from '../src/password-encoders/encoder-factory';
import {TestUserWithEncoder} from './mocks/test-user-with-encoder';
import {PlainTextPasswordEncoder} from '../src/password-encoders/plain-text.password-encoder';
import {BcryptPasswordEncoder} from '../src/password-encoders/bcrypt.password-encoder';
import {User} from '../src/models/user';
import {Application} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:Encoder', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should get encoder by name', async () => {
    let encoder = injector.get(EncoderFactory).get('plain-text');
    expect(encoder.getName()).toBe('plain-text');
  });

  it('should get encoder from user with defined encoder', async () => {
    let user = new TestUserWithEncoder('admin', 'pass', ['ADMIN']);
    let encoder = injector.get(EncoderFactory).getEncoder(user);
    expect(encoder.getName()).toBe('plain-text');
  });

  it('should get encoder from user without defined one', async () => {
    let user = new User('admin', 'pass', ['ADMIN']);
    let encoder = injector.get(EncoderFactory).getEncoder(user);
    expect(encoder.getName()).toBe('bcrypt');
  });

  it('should throw exception with non-existing encoder', async () => {
    let user = new TestUserWithEncoder('admin', 'pass', ['ADMIN']);
    user.encoderName = 'unknown';

    const fn = () => {
      injector.get(EncoderFactory).getEncoder(user);
    };
    expect(fn).toThrow(new RegExp('does not exist'));
  });

  describe('PlainTextEncoder', () => {
    it('should encode and validate', async () => {
      const encoder = new PlainTextPasswordEncoder();
      const encoded = await encoder.encodePassword('pass');
      const result1 = await encoder.isPasswordValid(encoded, 'pass');
      expect(result1).toBeTruthy();
      const result2 = await encoder.isPasswordValid(encoded, 'pass1');
      expect(result2).toBeFalsy();
    });
  });

  describe('BcryptPasswordEncoder', () => {
    it('should encode and validate', async () => {
      const encoder = new BcryptPasswordEncoder();
      const encoded = await encoder.encodePassword('pass');
      const result1 = await encoder.isPasswordValid(encoded, 'pass');
      expect(result1).toBeTruthy();
      const result2 = await encoder.isPasswordValid(encoded, 'pass1');
      expect(result2).toBeFalsy();
    });
  });
});
