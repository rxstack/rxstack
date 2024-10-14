import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';
import {ServiceRegistry} from '@rxstack/service-registry';

@Injectable()
export class EncoderFactory extends ServiceRegistry<PasswordEncoderInterface> {

  static readonly defaultEncoder = 'bcrypt';

  getEncoder(user: any): PasswordEncoderInterface {
    if (typeof user['getEncoderName'] === 'function') {
      const encoderName = user['getEncoderName']();
      return this.get(encoderName);
    }
    return this.get(EncoderFactory.defaultEncoder);
  }
}
