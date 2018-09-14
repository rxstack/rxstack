import {LoggerHandler, LoggerTransportInterface, LoggingLevel} from './interfaces';
import {Injectable} from 'injection-js';
import {Exception} from '@rxstack/exceptions';
const winstonLogger = require('winston');

@Injectable()
export class Logger {

  private transports: Map<string, LoggerTransportInterface> = new Map();

  constructor(registry: LoggerTransportInterface[], handlers: LoggerHandler[]) {
    registry.forEach((transport) => this.registerTransport(transport));
    this.init(handlers);
  }

  error(message: string, meta?: any): this {
    return this.log('error', message, meta);
  }

  warning(message: string, meta?: any): this {
    return this.log('warn', message, meta);
  }

  info(message: string, meta?: any): this {
    return this.log('info', message, meta);
  }

  debug(message: string, meta?: any): this {
    return this.log('debug', message, meta);
  }

  verbose(message: string, meta?: any): this {
    return this.log('verbose', message, meta);
  }
  
  silly(message: string, meta?: any): this {
    return this.log('silly', message, meta);
  }

  log(logLevel: LoggingLevel, message: string, meta?: any) {
    meta = meta ? meta : {};
    winstonLogger.log(logLevel, message, meta);
    return this;
  }

  private registerTransport(transport: LoggerTransportInterface): this {
    if (this.transports.has(transport.getName())) {
      throw new Exception(`Transport "${transport.getName()}" already exists.`);
    }
    this.transports.set(transport.getName(), transport);
    return this;
  }

  private init(handlers: LoggerHandler[]): this {
    winstonLogger.clear();
    handlers.forEach((handler) => {
      if (!this.transports.has(handler.type)) {
        throw new Exception(`Transport "${handler.type}" does not exist.`);
      }
      const transport = this.transports.get(handler.type);
      transport.applyOptions(handler.options);
      const transportInstance = transport.createInstance(handler.options);
      winstonLogger.add(transportInstance);
    });
    return this;
  }
}
