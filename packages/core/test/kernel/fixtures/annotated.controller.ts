import 'reflect-metadata';
import {Injectable} from 'injection-js';
import {Request, Response} from '../../../src/kernel/models';
import {Http, WebSocket} from '../../../src/kernel/metadata';

@Injectable()
export class AnnotatedController {
  @Http('GET', '/annotated', 'annotated_index')
  @WebSocket('annotated_index')
  async indexAction(request: Request): Promise<Response> {
    return new Response('AnnotatedController::indexAction');
  }

  @Http('GET', '/annotated/exception', 'annotated_exception')
  @WebSocket('annotated_exception')
  async exceptionAction(request: Request): Promise<Response> {
    throw new Error('Exception');
  }
}