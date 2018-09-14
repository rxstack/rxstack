import {ExpressServer} from './express.server';
import {ExpressServerConfiguration} from './express-server-configuration';
import {Module, ModuleWithProviders, SERVER_REGISTRY} from '@rxstack/core';

@Module()
export class ExpressModule {
  static configure(configuration?: ExpressServerConfiguration): ModuleWithProviders {
    return {
      module: ExpressModule,
      providers: [
        {
          provide: ExpressServerConfiguration,
          useFactory: () => {
            return Object.assign(new ExpressServerConfiguration(), configuration);
          },
          deps: []
        },
        { provide: SERVER_REGISTRY, useClass: ExpressServer, multi: true },
      ],
    };
  }
}