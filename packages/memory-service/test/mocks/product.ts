import {ResourceInterface} from '@rxstack/platform';

export class Product implements ResourceInterface {
  id: string;
  name: string;
  price: number;
  tags: string[];
}