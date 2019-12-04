import {ModuleType, ProviderDefinition} from './interfaces';

export class ApplicationOptions {
  imports?: ModuleType[];
  providers?: ProviderDefinition[];
  servers?: string[] = [];
  constructor(obj: any) {
    this.imports = obj['imports'] ? obj['imports'] : [];
    this.providers = obj['providers'] ? obj['providers'] : [];
    this.servers = Array.isArray(obj['servers']) ? obj['servers'] : [];
  }
}