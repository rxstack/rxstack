import {Injectable} from 'injection-js';

@Injectable()
export class DataContainer {

  private collections: Map<string, Map<string, any>> = new Map();

  getCollection<T>(name: string): Map<string, T> {
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