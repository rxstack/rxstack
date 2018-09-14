import {Injectable} from 'injection-js';
import {Request} from '@rxstack/core';
import {TokenExtractorInterface} from '../interfaces';
import {ServiceRegistry} from '@rxstack/service-registry';

@Injectable()
export class TokenExtractorManager extends ServiceRegistry<TokenExtractorInterface> {

  extract(request: Request): string {
    let token: string = null;
    this.all().forEach((extractor) => {
      if (token) {
        return;
      }
      token = extractor.extract(request);
    });
    return token;
  }
}