import {LoggerTransportInterface} from '../interfaces';
import {formatFunc} from '../utils';
import {Injectable} from 'injection-js';
const winston = require('winston');

@Injectable()
export class FileTransport implements LoggerTransportInterface {

  static readonly transportName = 'file';

  createInstance(options: Object): any {
    return new winston.transports.File(options);
  }

  getName(): string {
    return FileTransport.transportName;
  }

  applyOptions(options: Object): void {
    options['format'] = winston.format.combine(
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(formatFunc),
      winston.format.json()
    );
  }
}
