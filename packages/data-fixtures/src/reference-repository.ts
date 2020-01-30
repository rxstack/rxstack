import {Exception} from '@rxstack/exceptions';
import {Injectable} from 'injection-js';

@Injectable()
export class ReferenceRepository {

  private references: Map<string, any> = new Map();

  setReference(name: string, value: any): void {
    this.references.set(name, value);
  }

  getReference(name: string): any {
    if (!this.hasReference(name)) {
      throw new Exception(`Reference with name ${name} does not exist.`);
    }
    return this.references.get(name);
  }

  hasReference(name: string): boolean {
    return this.references.has(name);
  }

  reset(): void {
    this.references.clear();
  }
}