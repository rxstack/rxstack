import {Product} from './product';
import {ServiceInterface} from '@rxstack/platform';

export const loader = async <T>(service: ServiceInterface<T>, data: any[]): Promise<void> => {
  await data.reduce(
    async (current: Promise<Product>, item): Promise<void> => {
      await service.create(item);
    }, Promise.resolve(null)
  );
};