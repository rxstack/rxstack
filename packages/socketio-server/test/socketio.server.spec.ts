import 'reflect-metadata';
import {Application, ServerManager} from '@rxstack/core';
import {Injector} from 'injection-js';
import {SocketioServer} from '../src/socketio.server';
import {MockEventListener} from './mocks/mock-event-listener';
import {SOCKET_APP_OPTIONS} from './mocks/socketio-app-options';
const io = require('socket.io-client');


describe('SocketIOServer', () => {
  // Setup application
  const app = new Application(SOCKET_APP_OPTIONS);
  let injector: Injector;
  let host: string;
  let server: SocketioServer;
  let defaultNs: any;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    server = <SocketioServer>injector.get(ServerManager).getByName('socketio');
    host = server.getHost();
    defaultNs = io(host, {transports: ['websocket']});
  });

  after(async() =>  {
    defaultNs.close();
    await app.stop();
  });

  it('should get the engine', () => {
    (typeof server.getEngine()).should.not.be.undefined;
  });


  it('should call mock_json', (done: Function) => {
    defaultNs.emit('mock_json', null, function (response: any) {
      response['statusCode'].should.be.equal(200);
      JSON.stringify(response['content']).should.be.equal(JSON.stringify({ id: 'json' }));
      done();
    });
  });

  it('should call mock_null', (done: Function) => {
    defaultNs.emit('mock_null', null, function (response: any) {
      response['statusCode'].should.be.equal(200);
      (null === response['content']).should.be.true;
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
      response['statusCode'].should.be.equal(404);
      response['message'].should.be.equal('Not Found');
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
      response['statusCode'].should.be.equal(500);
      response['message'].should.be.equal('something');
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
      response['statusCode'].should.be.equal(500);
      response['message'].should.be.equal('Internal Server Error');
      process.env.NODE_ENV = 'testing';
      done();
    });
  });

  it('should throw exception if streamable', (done: Function) => {
    defaultNs.emit('mock_stream', null, function (response: any) {
      response['statusCode'].should.be.equal(500);
      response['message'].should.be.equal('Streaming is not supported.');
      done();
    });
  });


  it('should add another user and receive a message', (done: Function) => {
    const client2 = io(host, {transports: ['websocket']});
    client2.on('connect', () => {
      injector.get(MockEventListener).connectedUsers.length.should.be.equal(2);
      client2.on('hi', (event: any) => {
        event.should.be.equal('all');
        client2.close();
        done();
      });
    });
  });

});
