import {AbstractFixture} from './abstract-fixture';
import {InjectionToken} from 'injection-js';

export interface PurgerInterface {
  purge(): Promise<void>;
}

export const FIXTURE_REGISTRY = new InjectionToken<AbstractFixture[]>('FIXTURE_REGISTRY');
export const PURGER_SERVICE = new InjectionToken<PurgerInterface>('PURGER_SERVICE');