import {Module, ModuleWithProviders, SERVER_REGISTRY} from '@rxstack/core';
import {SocketioServer} from './socketio.server';
import {SocketioServerConfiguration} from './socketio-server-configuration';

@Module()
export class SocketioModule {
  static configure(configuration?: SocketioServerConfiguration): ModuleWithProviders {
    return {
      module: SocketioModule,
      providers: [
        { provide: SERVER_REGISTRY, useClass: SocketioServer, multi: true },
        {
          provide: SocketioServerConfiguration,
          useFactory: () => {
            return Object.assign(new SocketioServerConfiguration(), configuration);
          },
          deps: []
        },
      ]
    };
  }
}