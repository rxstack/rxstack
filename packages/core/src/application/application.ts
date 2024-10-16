import 'reflect-metadata';
import {Injector, ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {Kernel} from '../kernel';
import {
  AsyncEventDispatcher, EVENT_LISTENER_KEY, EventListenerMetadata,
  ObserverMetadata
} from '@rxstack/async-event-dispatcher';
import {BootstrapEvent} from './bootstrap-event';
import {ApplicationEvents} from './application-events';
import {
  MODULE_KEY, ModuleMetadata, ModuleType,
  ProviderDefinition
} from './interfaces';
import {ServerManager} from '../server';
import {CORE_PROVIDERS} from './CORE_PROVIDERS';
import {ApplicationOptions} from './application-options';
import {CommandManager} from '../console';

export class Application {
  private providers: ProviderDefinition[];
  private injector: Injector;
  private options: ApplicationOptions;
  constructor(options: ApplicationOptions) {
    this.options = new ApplicationOptions(options);
  }

  async run(): Promise<Injector> {
    if (this.injector) {
      return this.injector;
    }
    this.providers = [];
    this.options.imports.forEach((module) => this.resolveModule(module));
    this.providers.push(...this.options.providers);
    this.injector = await this.doBootstrap();
    return this.injector;
  }

  async cli(): Promise<this> {
    process.env.rxstack_mode = 'cli';
    const injector = await this.run();
    injector.get(CommandManager).execute();
    return this;
  }

  async start(): Promise<this> {
    process.env.rxstack_mode = 'server';
    const injector = await this.run();
    const manager = injector.get(ServerManager);
    await manager.start();
    return this;
  }

  async stop(): Promise<this> {
    // this.injector.get(Kernel).reset(); todo - should be removed???
    const manager = this.injector.get(ServerManager);
    try {
      await manager.stop();
    } catch (e) {
      // in case servers have never been started.
    }
    return this;
  }

  getInjector(): Injector {
    return this.injector;
  }

  private async doBootstrap(): Promise<Injector> {
    return await Promise.all(this.providers).then(async (providers) => {
      const resolvedProviders = ReflectiveInjector.resolve(CORE_PROVIDERS(this.options).concat(providers));
      const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
      const dispatcher = injector.get(AsyncEventDispatcher);
      resolvedProviders.forEach((provider: ResolvedReflectiveProvider) => {
        const service = injector.get(provider.key.token);
        this.resolveInjectorAwareService(service, injector);
        this.resolveEventListeners(service, dispatcher);
      });
      const bootstrapEvent = new BootstrapEvent(injector, resolvedProviders);
      await dispatcher.dispatch(ApplicationEvents.BOOTSTRAP, bootstrapEvent);
      injector.get(Kernel).initialize();
      return injector;
    });
  }

  private resolveModule(target: ModuleType): void {
    const moduleMetadata: ModuleMetadata = this.getModuleMetadata(target);
    moduleMetadata.providers.forEach((provider: ProviderDefinition) => this.providers.push(provider));
  }

  private getModuleMetadata(target: ModuleType): ModuleMetadata {
    const moduleMetadata: ModuleMetadata =
      // @ts-ignore
      Reflect.getMetadata(MODULE_KEY, target['module'] ? target['module'] : target);

    // @ts-ignore
    if (Array.isArray(target['providers'])) {
      // @ts-ignore
      moduleMetadata.providers.push(...target['providers']);
    }
    return moduleMetadata;
  }

  private resolveInjectorAwareService(service: Record<string, any>, injector: Injector): void {
    if (Array.isArray(service)) {
      service.forEach((s: Record<string, any>) => this.resolveInjectorAwareService(s, injector));
    } else if (typeof service['setInjector'] === 'function') {
      service['setInjector'](injector);
    }
  }

  private resolveEventListeners(service: Record<string, any>, dispatcher: AsyncEventDispatcher): void {
    if (Reflect.hasMetadata(EVENT_LISTENER_KEY, service.constructor)) {
      const metadata: EventListenerMetadata = Reflect.getMetadata(EVENT_LISTENER_KEY, service.constructor);
      metadata.observers.forEach((observer: ObserverMetadata) => {
        dispatcher.addListener(
          observer.eventName,
          service[observer.propertyKey].bind(service),
          observer.priority
        );
      });
    }
  }
}
