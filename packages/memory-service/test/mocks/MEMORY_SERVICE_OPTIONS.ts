import {ApplicationOptions} from '@rxstack/core';
import {
  MemoryService,
  MemoryServiceModule
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Product} from './product';
import {MemoryPurger} from '../../src/memory-purger';

export const PRODUCT_SERVICE = new InjectionToken<MemoryService<Product>>('PRODUCT_SERVICE');

export const MEMORY_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [MemoryServiceModule],
  providers: [
    {
      provide: PRODUCT_SERVICE,
      useFactory: () => {
        return new MemoryService({ idField: 'id', collectionName: 'products' });
      },
      deps: [],
    },
    { provide: MemoryPurger, useClass: MemoryPurger }
  ],
  logger: {
    handlers: [
      {
        type: 'console',
        options: {
          level: 'silly',
        }
      }
    ]
  },
};