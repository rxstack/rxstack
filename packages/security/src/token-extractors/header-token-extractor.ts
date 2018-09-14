import {Injectable} from 'injection-js';
import {TokenExtractorInterface} from '../interfaces';
import {SecurityConfiguration} from '../security-configuration';
import {Request} from '@rxstack/core';

@Injectable()
export class HeaderTokenExtractor implements TokenExtractorInterface {

  static readonly EXTRACTOR_NAME = 'header_extractor';

  constructor(private config: SecurityConfiguration) { }

  extract(request: Request): string {
    const name = this.config.token_extractors.authorization_header.name.toLowerCase();
    const prefix = this.config.token_extractors.authorization_header.prefix;
    if (request.headers.has(name) && this.config.token_extractors.authorization_header.enabled) {
      return this._extract(request.headers.get(name), prefix);
    }
    return null;
  }

  getName(): string {
    return HeaderTokenExtractor.EXTRACTOR_NAME;
  }

  private _extract(header: string, prefix: string): string {
    let headerParts = header.split(' ');
    if (!(headerParts.length === 2 && headerParts[0] === prefix)) {
      return null;
    }
    return headerParts[1];
  }
}