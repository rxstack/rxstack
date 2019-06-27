import {Http, Request, Response} from '@rxstack/core';
import {NotFoundException, RangeNotSatisfiableException} from '@rxstack/exceptions';
import {parseRange} from '@rxstack/utils';
const fs = require('fs');

export class MockController {

  @Http('GET', '/mock/text', 'mock_text')
  async textAction(): Promise<Response> {
    return new Response('something');
  }

  @Http('GET', '/mock/json', 'mock_json')
  async jsonAction(request: Request): Promise<Response> {
    return new Response({'id': 'json'});
  }

  @Http('GET', '/mock/download', 'mock_download')
  async downloadAction(request: Request): Promise<Response> {
    const path =  __dirname + '/../assets/video.mp4';
    const st = fs.createReadStream(path);
    const response = new Response(st);
    response.headers.set('Content-Disposition', `attachment; filename="video.mp4"`);
    response.headers.set('Cache-Control', 'public, max-age=0');
    response.headers.set('Content-Type', 'video/mp4');
    return response;
  }

  @Http('GET', '/mock/stream', 'mock_stream')
  async streamAction(request: Request): Promise<Response> {
    const path = __dirname + '/../assets/video.mp4';
    const stat = fs.statSync(path);
    const size = stat.size;
    const response = new Response();
    const result = parseRange(request.headers.get('range'), size);
    if (!result) {
      response.headers.set('Content-Range', 'bytes */' + size);
      throw new RangeNotSatisfiableException();
    }
    response.headers.set('Content-Range', `bytes ${result.start}-${result.end}/${size}`);
    response.headers.set('Accept-Ranges', 'bytes');
    response.headers.set('Content-Length', result.chunkSize);
    response.headers.set('Cache-Control', 'no-cache');
    response.headers.set('Content-Type', 'video/mp4');
    response.content = fs.createReadStream(path, result);
    response.statusCode = 206;
    return response;
  }

  @Http('GET', '/mock/exception', 'mock_exception')
  async exceptionAction(request: Request): Promise<Response> {
    if (parseInt(request.params.get('code')) === 404) {
      throw new NotFoundException();
    }
    throw new Error('something');
  }
}