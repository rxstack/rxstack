import {Injectable} from 'injection-js';
import {readFile} from '../utils';
import {Rsa, SecurityConfiguration} from '../security-configuration';
import {KeyType} from '../interfaces';

@Injectable()
export class KeyLoader {
  constructor(protected config: SecurityConfiguration) { }

  async loadKey(type: KeyType): Promise<Buffer|string> {
    if (this.config.secret instanceof Rsa) {
      return await readFile(this.config.secret[type]);
    }
    return this.config.secret;
  }
}