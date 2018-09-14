import {EncoderAwareInterface} from '../../src/interfaces';
import {User} from '../../src/models/user';

export class TestUserWithEncoder extends User implements EncoderAwareInterface {

  encoderName = 'plain-text';

  getEncoderName(): string {
    return this.encoderName;
  }
}