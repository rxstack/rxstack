import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';

@Injectable()
export class PlainTextPasswordEncoder implements PasswordEncoderInterface {

  static readonly ENCODER_NAME = 'plain-text';

  async encodePassword(raw: string): Promise<string> {
    return raw;
  }

  async isPasswordValid(encoded: string, raw: string): Promise<boolean> {
    return encoded === raw;
  }

  getName(): string {
    return PlainTextPasswordEncoder.ENCODER_NAME;
  }
}