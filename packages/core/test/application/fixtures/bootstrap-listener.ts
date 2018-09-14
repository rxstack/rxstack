import {BootstrapEvent} from '../../../src/application/bootstrap-event';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ApplicationEvents} from '../../../src/application/application-events';
import {Injectable, ResolvedReflectiveProvider} from 'injection-js';
import {Service1} from './service1';

@Injectable()
export class BootstrapListener {

  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    // create a service
    const service1 = event.injector.resolveAndInstantiate({
      provide: Service1,
      useClass: Service1
    });

    event.resolvedProviders.forEach((resolvedProvider: ResolvedReflectiveProvider) => {
      const service = event.injector.get(resolvedProvider.key.token);
      if (typeof service['setService1'] === 'function') {
        service['setService1'](service1);
      }
    });
  }
}