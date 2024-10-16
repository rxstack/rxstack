import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {ExpressServer} from '../src/express.server';
import {Injector} from 'injection-js';
import {Application, ServerManager} from '@rxstack/core';
import {EXPRESS_APP_OPTIONS} from './mocks/express-app-options';
import * as _ from 'lodash';

const fetch = require('node-fetch');

describe('ExpressServer', () => {

  // Setup application
  const app = new Application(EXPRESS_APP_OPTIONS);
  let injector: Injector;
  let host: string;
  let expressServer: ExpressServer;

  beforeAll(async() =>  {
    await app.start();
    injector = app.getInjector();
    expressServer = <ExpressServer>injector.get(ServerManager).getByName('express');
    host = 'http://localhost:3200/api';
  });

  afterAll(async() =>  {
    await app.stop();
  });

  it('should get the engine', async () => {
    expect(typeof expressServer.getEngine()).toBeDefined();
  });

  it('should call mock_text', async () => {
    const response: any = await fetch(host + '/mock/text');
    const headers: any = response.headers;
    const content = await response.text();
    expect(headers.get('x-powered-by')).toBe('Express');
    expect(headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(response.status).toBe(200);
    expect(content).toBe('something');
  });

  it('should call mock_json', async () => {
    const response: any = await fetch(host + '/mock/json');
    const headers = response.headers;
    const content = await response.json();
    expect(headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.status).toBe(200);
    expect(_.isEqual(content, { id: 'json' })).toBeTruthy();
  });

  it('should call express middleware', async () => {
    const response: any = await fetch(host + '/express-middleware');
    const headers = response.headers;
    const content = await response.json();
    expect(headers.get('x-powered-by')).toBe('Express');
    expect(headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.status).toBe(200);
    expect(_.isEqual(content, { id: 'express' })).toBeTruthy();
  });

  it('should download file', async () => {
    const response: any = await fetch(host + '/mock/download');
    const headers = response.headers;
    expect(response.status).toBe(200);
    expect(headers.get('content-disposition')).toBe('attachment; filename="video.mp4"');
    expect(headers.get('content-type')).toBe('video/mp4');
  });

  it('should stream video', async () => {
    const options = {
      headers: {
        'Range': 'bytes=1-200'
      },
      method: 'GET',
    };

    const response: any = await fetch(host + '/mock/stream', options);
    const headers = response.headers;
    expect(response.status).toBe(206);
    expect(headers.get('content-range')).toBe('bytes 1-200/424925');
    expect(headers.get('content-length')).toBe('200');
  });

  it('should throw an 404 exception', async () => {
    const response = await fetch(host + '/mock/exception?code=404');
    const content: any = await response.json();
    expect(response.status).toBe(404);
    expect(content['message']).toBe('Not Found');
  });

  it('should throw an exception', async () => {

    const response = await fetch(host + '/mock/exception');
    const content: any = await response.json();

    expect(response.status).toBe(500);
    expect(content['message']).toBe('something');
  });

  it('should throw an exception in production', async () => {
    process.env.NODE_ENV = 'production';
    const response = await fetch(host + '/mock/exception');
    const content: any = await response.json();

    expect(response.status).toBe(500);
    expect(content['message']).toBe('Internal Server Error');

    process.env.NODE_ENV = 'testing';
  });

  it('should handle middleware exception', async () => {
    const response = await fetch(host + '/express-middleware-error');
    expect(response.status).toBe(500);
  });
});
