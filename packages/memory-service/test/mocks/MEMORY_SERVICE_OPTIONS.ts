import {ApplicationOptions} from '@rxstack/core';
import {
  DataContainer, MATCHER_TOKEN,
  MatcherInterface,
  MemoryService,
  MemoryServiceModule, SORTER_TOKEN,
  SorterInterface
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Product} from './product';

export const PRODUCT_SERVICE = new InjectionToken<MemoryService<Product>>('PRODUCT_SERVICE');

export const MEMORY_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [MemoryServiceModule],
  providers: [
    {
      provide: PRODUCT_SERVICE,
      useFactory: (dataContainer: DataContainer<Product>, matcher: MatcherInterface, sorter: SorterInterface) => {
        return new MemoryService(dataContainer, Product, 'products', matcher, sorter);
      },
      deps: [DataContainer, MATCHER_TOKEN, SORTER_TOKEN],
    }
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