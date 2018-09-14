import {ConsoleTransport} from '../../../src/logger/transports/index';

const winston = require('winston');

export class ConsoleTestTransport extends ConsoleTransport {

  protected createFormatter(): any {
    const formatter = winston.format.combine(
      winston.format.printf((info: any) => {
        const {
           message, ...args
        } = info;
        const source = args['source'] ? `[${args['source']}]` : '';
        delete args['source'];
        const meta = Object.keys(args).length ? JSON.stringify(args, null, 2) : '';
        return `${source} ${message} ${meta}`;
      }),
    );

    return formatter;
  }

  getName(): string {
    return 'console.test';
  }
}
