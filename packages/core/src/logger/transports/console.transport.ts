import {LoggerTransportInterface} from '../interfaces';
import {formatFunc} from '../utils';
import {Injectable} from 'injection-js';
const winston = require('winston');

@Injectable()
export class ConsoleTransport implements LoggerTransportInterface {

  static transportName = 'console';
  
  createInstance(options: Object): any {
    return new winston.transports.Console(options);
  }

  getName(): string {
    return ConsoleTransport.transportName;
  }

  applyOptions(options: Object): void {
    options['format'] =  winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(formatFunc),
    );
  }
}
