import 'reflect-metadata';
import {ExpressServer} from '../src/express.server';
import {Injector} from 'injection-js';
import {Application, ServerManager} from '@rxstack/core';
import {EXPRESS_APP_OPTIONS} from './mocks/express-app-options';
import * as _ from 'lodash';

const rp = require('node-fetch');

describe('ExpressServer', () => {

  // Setup application
  const app = new Application(EXPRESS_APP_OPTIONS);
  let injector: Injector;
  let host: string;
  let expressServer: ExpressServer;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    expressServer = <ExpressServer>injector.get(ServerManager).getByName('express');
    host = 'http://localhost:3200/api';
  });

  after(async() =>  {
    await app.stop();
  });

  it('should get the engine', async () => {
    (typeof expressServer.getEngine()).should.not.be.undefined;
  });

  it('should call mock_text', async () => {
    const response: any = await rp(host + '/mock/text');
    const headers: any = response.headers;
    const content = await response.text();
    headers.get('x-powered-by').should.be.equal('Express');
    headers.get('content-type').should.be.equal('text/html; charset=utf-8');
    response.status.should.be.equal(200);
    content.should.be.equal('something');
  });

  it('should call mock_json', async () => {
    const response: any = await rp(host + '/mock/json');
    const headers = response.headers;
    const content = await response.json();
    headers.get('content-type').should.be.equal('application/json; charset=utf-8');
    response.status.should.be.equal(200);
    _.isEqual(content, { id: 'json' }).should.be.equal(true);
  });

  it('should call express middleware', async () => {
    const response: any = await rp(host + '/express-middleware');
    const headers = response.headers;
    const content = await response.json();
    headers.get('x-powered-by').should.be.equal('Express');
    headers.get('content-type').should.be.equal('application/json; charset=utf-8');
    response.status.should.be.equal(200);
    _.isEqual(content, { id: 'express' }).should.be.equal(true);
  });

  it('should download file', async () => {
    const response: any = await rp(host + '/mock/download');
    const headers = response.headers;
    response.status.should.be.equal(200);
    headers.get('content-disposition').should.be.equal('attachment; filename="video.mp4"');
    headers.get('content-type').should.be.equal('video/mp4');
  });

  it('should stream video', async () => {
    const options = {
      headers: {
        'Range': 'bytes=1-200'
      },
      method: 'GET',
    };

    const response: any = await rp(host + '/mock/stream', options);
    const headers = response.headers;
    response.status.should.be.equal(206);
    headers.get('content-range').should.be.equal('bytes 1-200/424925');
    headers.get('content-length').should.be.equal('200');
  });

  it('should throw an 404 exception', async () => {
    const response = await rp(host + '/mock/exception?code=404');
    const content = await response.json();
    response.status.should.be.equal(404);
    content['message'].should.be.equal('Not Found');
  });

  it('should throw an exception', async () => {

    const response = await rp(host + '/mock/exception');
    const content = await response.json();

    response.status.should.be.equal(500);
    content['message'].should.be.equal('something');
  });

  it('should throw an exception in production', async () => {
    process.env.NODE_ENV = 'production';
    const response = await rp(host + '/mock/exception');
    const content = await response.json();

    response.status.should.be.equal(500);
    content['message'].should.be.equal('Internal Server Error');

    process.env.NODE_ENV = 'testing';
  });

  it('should handle middleware exception', async () => {
    const response = await rp(host + '/express-middleware-error');
    response.status.should.be.equal(500);
  });
});
