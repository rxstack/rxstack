import {Injectable} from 'injection-js';
import {AbstractCommand} from './abstract-command';
import {HttpMetadata, httpMetadataStorage} from '../kernel/metadata';

const table = require('table').table;

@Injectable()
export class DebugHttpMetadataCommand extends AbstractCommand {

  command = 'debug:http-metadata';
  describe = 'Prints http metadata for an application.';

  async handler(argv: any): Promise<void> {
    const data = [
      ['name', 'method', 'path', 'controller', 'action']
    ];
    httpMetadataStorage.all().forEach((metadata: HttpMetadata) => data.push([
      metadata.name, metadata.httpMethod, metadata.path, metadata.target.name, metadata.propertyKey
    ]));
    console.log(table(data));
  }
}