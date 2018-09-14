import {MockController} from './mock.controller';
import {ApplicationOptions} from '@rxstack/core';
import {SocketioModule} from '../../src/socketio.module';
import {MockEventListener} from './mock-event-listener';
import {socketio_environment} from '../environments/socketio-environment';

export const SOCKET_APP_OPTIONS: ApplicationOptions = {
  imports: [
    SocketioModule.configure(socketio_environment.socketio_server)
  ],
  providers: [
    { provide: MockController, useClass: MockController },
    { provide: MockEventListener, useClass: MockEventListener },
  ],
  servers: socketio_environment.servers,
  logger: socketio_environment.logger
};