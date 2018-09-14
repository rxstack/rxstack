import {Injectable} from 'injection-js';
import {KeyLoader} from './key-loader';
import {JWTDecodeFailureException, JWTEncodeFailureException} from '../exceptions';
import {KeyType, Secret, TokenManagerInterface} from '../interfaces';
import {Rsa, SecurityConfiguration} from '../security-configuration';
const jwt = require('jsonwebtoken');

@Injectable()
export class TokenManager implements TokenManagerInterface {

  constructor(private keyLoader: KeyLoader, private config: SecurityConfiguration) {}

  async encode(payload: Object): Promise<string> {
    const key = await this.keyLoader.loadKey(KeyType.PRIVATE_KEY);
    let secret: Secret|string;

    if (this.config.secret instanceof Rsa) {
      secret = { key: key, passphrase: this.config.secret['passphrase'] };
    } else {
      secret = this.config.secret;
    }

    try {
      return jwt.sign(payload, secret, {
        algorithm: this.config.signature_algorithm,
        expiresIn: this.config.ttl,
        issuer: this.config.issuer
      });
    } catch (e) {
      throw new JWTEncodeFailureException(
        'An error occured while trying to encode the JWT token. ' +
        'Please verify your configuration (private key/passphrase)',
        e.message);
    }
  }

  async decode(token: string): Promise<Object> {
    const loadedPublicKey = await this.keyLoader.loadKey(KeyType.PUBLIC_KEY);
    let options: Object = {
      algorithms: [this.config.signature_algorithm],
      issuer: this.config.issuer
    };

    try {
      return  jwt.verify(token, loadedPublicKey, options);
    } catch (e) {
      throw new JWTDecodeFailureException('Invalid JWT Token', e.message);
    }
  }
}