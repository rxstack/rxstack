import {BaseMetadata} from './metadata';

export class GenericMetadataStorage<T extends BaseMetadata> {

  private items: T[] = [];

  all(): T[] {
    return this.items;
  }

  get(name: string): T {
    return this.all().find(metadata => metadata.name === name);
  }

  has(name: string): boolean {
    return !!this.get(name);
  }

  add(metadata: T): void {
    if (!this.has(metadata.name)) {
      this.all().push(metadata);
    }
  }

  remove(name: string): void {
    const idx = this.all()
      .findIndex((metadata) => metadata.name === name);
    if (idx !== -1) {
      this.all().splice(idx, 1);
    }
  }
  
  reset(): void {
    this.items = [];
  }
}

