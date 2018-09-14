import {Observe} from '@rxstack/async-event-dispatcher';
import {exceptionMiddleware, expressMiddleware, requestModifierMiddleware} from './express.middleware';
import {Injectable, Injector} from 'injection-js';
import {ExpressServer} from '../../src/express.server';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/core';
import {express_server_environment} from '../environments/express_server_environment';

@Injectable()
export class ConfigurationListener {

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @Observe(ServerEvents.CONFIGURE)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.server.getName() !== ExpressServer.serverName) {
      return;
    }

    event.server.getEngine()
      .get(express_server_environment.express_server.prefix + '/express-middleware', expressMiddleware(this.injector))
      .get(express_server_environment.express_server.prefix + '/mock/json', requestModifierMiddleware(this.injector))
      .get(express_server_environment.express_server.prefix + '/express-middleware-error', exceptionMiddleware(this.injector))
    ;
  }
}