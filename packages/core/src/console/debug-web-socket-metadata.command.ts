import {Injectable} from 'injection-js';
import {AbstractCommand} from './abstract-command';
import {WebSocketMetadata, webSocketMetadataStorage} from '../kernel/metadata';

const table = require('table').table;

@Injectable()
export class DebugWebSocketMetadataCommand extends AbstractCommand {

  command = 'debug:web-socket-metadata';
  describe = 'Prints web socket metadata for an application.';

  async handler(argv: any): Promise<void> {
    const data = [
      ['name', 'controller', 'action']
    ];
    webSocketMetadataStorage.all().forEach((metadata: WebSocketMetadata) => data.push([
      metadata.name,
      metadata.target.name,
      metadata.propertyKey
    ]));
    console.log(table(data));
  }
}