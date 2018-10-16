import {Product} from './product';
import {ServiceInterface, ResourceInterface} from '@rxstack/platform';

export const loader = async <T extends ResourceInterface>(service: ServiceInterface<T>, data: any[]): Promise<void> => {
  await data.reduce(
    async (current: Promise<Product>, item): Promise<void> => {
      const product = await service.createNew();
      await service.save(Object.assign(product, item));
    }, Promise.resolve(null)
  );
};