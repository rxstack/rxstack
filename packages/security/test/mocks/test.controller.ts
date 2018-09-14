import {Http, Request, Response, WebSocket} from '@rxstack/core';
import {Injectable} from 'injection-js';
import {UnauthorizedException} from '@rxstack/exceptions';

@Injectable()
export class TestController {

  @Http('GET', '/test/index', 'test_index')
  @WebSocket('test_index')
  async indexAction(request: Request): Promise<Response> {
    if (!request.token.hasRole('ROLE_ADMIN')) {
      throw new UnauthorizedException();
    }
    return new Response(request.token.getUsername());
  }

  @Http('GET', '/test/anon', 'test_anon')
  @WebSocket('test_anon')
  async anonAction(request: Request): Promise<Response> {
    return new Response({
      username: request.token.getUsername(),
      credentials: request.token.getCredentials()
    });
  }
}