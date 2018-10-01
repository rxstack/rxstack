import {Module, ModuleWithProviders} from '@rxstack/core';
import {ApiResourceListener} from './event-listeners';
import {Validator} from 'class-validator';

@Module()
export class PlatformModule {
  static configure(): ModuleWithProviders {
    return {
      module: PlatformModule,
      providers: [
        { provide: Validator, useClass: Validator },
        { provide: ApiResourceListener, useClass: ApiResourceListener },
      ]
    };
  }
}