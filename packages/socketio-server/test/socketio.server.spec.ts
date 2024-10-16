import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application, ServerManager} from '@rxstack/core';
import {Injector} from 'injection-js';
import {SocketioServer} from '../src/socketio.server';
import {MockEventListener} from './mocks/mock-event-listener';
import {SOCKET_APP_OPTIONS} from './mocks/socketio-app-options';
import * as _ from 'lodash';
const io = require('socket.io-client');


describe('SocketIOServer', () => {
  // Setup application
  const app = new Application(SOCKET_APP_OPTIONS);
  let injector: Injector;
  let host: string;
  let server: SocketioServer;
  let defaultNs: any;

  beforeAll(async() =>  {
    await app.start();
    injector = app.getInjector();
    server = <SocketioServer>injector.get(ServerManager).getByName('socketio');
    host = server.getHost();
    defaultNs = io(host, {transports: ['websocket']});
  });

  afterAll(async() =>  {
    defaultNs.close();
    await app.stop();
  });

  it('should get the engine', () => {
    expect(typeof server.getEngine()).toBeDefined();
  });


  it('should call mock_json', (done: Function) => {
    defaultNs.emit('mock_json', null, function (response: any) {
      expect(response['statusCode']).toBe(200);
      expect(_.isEqual(response['content'], { id: 'json' })).toBeTruthy();
      done();
    });
  });

  it('should call mock_null', (done: Function) => {
    defaultNs.emit('mock_null', null, function (response: any) {
      expect(response['statusCode']).toBe(200);
      expect(null === response['content']).toBeTruthy();
      done();
    });
  });

  it('should throw an 404 exception', (done: Function) => {
    const args = {
      'params': {
        'code': 404
      }
    };

    defaultNs.emit('mock_exception', args, function (response: any) {
      expect(response['statusCode']).toBe(404);
      expect(response['message']).toBe('Not Found');
      done();
    });
  });

  it('should throw an 500 exception', (done: Function) => {
    const args = {
      'params': {
        'code': 500
      }
    };

    defaultNs.emit('mock_exception', args, function (response: any) {
      expect(response['statusCode']).toBe(500);
      expect(response['message']).toBe('something');
      done();
    });
  });

  it('should throw an 500 exception in production', (done: Function) => {
    const args = {
      'params': {
        'code': 500
      }
    };

    process.env.NODE_ENV = 'production';

    defaultNs.emit('mock_exception', args, function (response: any) {
      expect(response['statusCode']).toBe(500);
      expect(response['message']).toBe('Internal Server Error');
      process.env.NODE_ENV = 'testing';
      done();
    });
  });

  it('should throw exception if streamable', (done: Function) => {
    defaultNs.emit('mock_stream', null, function (response: any) {
      expect(response['statusCode']).toBe(500);
      expect(response['message']).toBe('Streaming is not supported.');
      done();
    });
  });


  it('should add another user and receive a message', (done: Function) => {
    const client2 = io(host, {transports: ['websocket']});
    client2.on('connect', () => {
      expect(injector.get(MockEventListener).connectedUsers.length).toBe(2);
      client2.on('hi', (event: any) => {
        expect(event).toBe('all');
        client2.close();
        done();
      });
    });
  });

});
