import {Injectable} from 'injection-js';
import {ResourceInterface} from '@rxstack/platform';

@Injectable()
export class DataContainer<T extends ResourceInterface> {

  private collections: Map<string, Map<string, T>> = new Map();

  getCollection(name: string): Map<string, T> {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }
    return this.collections.get(name);
  }

  count(): number {
    return this.collections.size;
  }

  async purge(): Promise<void> {
    this.collections.clear();
  }
}