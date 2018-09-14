import {ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {GenericEvent} from '@rxstack/async-event-dispatcher';

export class BootstrapEvent extends GenericEvent {
  constructor(public readonly injector: ReflectiveInjector,
              public readonly resolvedProviders: ResolvedReflectiveProvider[]) {
    super();
  }
}