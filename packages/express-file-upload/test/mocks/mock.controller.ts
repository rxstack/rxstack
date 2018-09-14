import {Request, Response, Http} from '@rxstack/core';

export class MockController {

  @Http('POST', '/mock/upload', 'mock_upload')
  async uploadAction(request: Request): Promise<Response> {
    return new Response(request.files.get('file'));
  }

  @Http('GET', '/mock/upload', 'mock_upload_dummy')
  async dummyAction(request: Request): Promise<Response> {
    return new Response('dummy');
  }
}