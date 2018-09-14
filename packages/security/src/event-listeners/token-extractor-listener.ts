import {Injectable} from 'injection-js';
import {TokenExtractorManager} from '../token-extractors/token-extractor-manager';
import {KernelEvents, Request, RequestEvent} from '@rxstack/core';
import {Observe} from '@rxstack/async-event-dispatcher';
import {Token} from '../models/token';
import {AnonymousToken} from '../models/anonymous.token';

@Injectable()
export class TokenExtractorListener {

  constructor(private extractor: TokenExtractorManager) { }

  @Observe(KernelEvents.KERNEL_REQUEST, 150)
  async onRequest(event: RequestEvent): Promise<void> {
    const request = event.getRequest();
    request.token = new AnonymousToken();
    switch (request.transport) {
      case 'HTTP':
        this.createTokenFromHttpRequest(request);
        break;
      case 'SOCKET':
        this.createTokenFromSocketRequest(request);
        break;
    }
  }

  private createTokenFromHttpRequest(request: Request): void {
    const rawToken = this.extractor.extract(request);
    if (rawToken) {
      request.token = new Token(rawToken);
    }
  }

  private createTokenFromSocketRequest(request: Request): void {
    if (request.connection && request.connection['token']) {
      request.token = request.connection['token'];
    }
  }
}