import {Injectable} from 'injection-js';
import {readFile} from '../utils';
import {Rsa, SecretConfiguration} from '../security-configuration';
import {KeyType} from '../interfaces';
import {NamedServiceInterface} from '@rxstack/service-registry';

@Injectable()
export class SecretLoader implements NamedServiceInterface {

  protected public_key?: Buffer|string;

  protected private_key?: Buffer|string;

  constructor(public config: SecretConfiguration) { }

  async loadKey(type: KeyType): Promise<Buffer|string> {
    if (this[type]) {
      return this[type];
    }
    if (this.config.secret instanceof Rsa) {
      this[type] = await readFile(this.config.secret[type]);
    } else {
      this[type] = this.config.secret;
    }
    return this[type];
  }

  getName(): string {
    return this.config.issuer;
  }
}