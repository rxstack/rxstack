const Transport = require('winston-transport');

export class CustomTransport extends Transport {
  log(info: any, next: () => void): any { next(); }
}
