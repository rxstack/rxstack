import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';
const bcrypt = require('bcrypt');

@Injectable()
export class BcryptPasswordEncoder implements PasswordEncoderInterface {

  static readonly ENCODER_NAME = 'bcrypt';

  async encodePassword(raw: string): Promise<string> {
    return bcrypt.hash(raw, 10);
  }

  async isPasswordValid(encoded: string, raw: string): Promise<boolean> {
    return await bcrypt.compare(raw, encoded);
  }

  getName(): string {
    return BcryptPasswordEncoder.ENCODER_NAME;
  }
}