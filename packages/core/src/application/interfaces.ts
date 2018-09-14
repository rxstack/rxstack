import {Injector, Provider} from 'injection-js';

export const MODULE_KEY = '__RX_STACK_MODULE__';

export type ProviderDefinition = Provider | Promise<Provider>;

export type ModuleType = ModuleInterface | ModuleWithProviders;

export interface ModuleInterface {}

export interface ModuleMetadata {
  providers?: ProviderDefinition[];
}

export interface ModuleWithProviders extends ModuleMetadata {
  module: ModuleInterface;
}

export interface InjectorAwareInterface {
  setInjector(injector: Injector): void;
}