import {Connection, FilterFn} from './interfaces';

export class Channel {

  connections: Connection[] = [];

  children: Channel[] = [];

  constructor(public ns: string) {}

  get length(): number {
    return this.connections.length;
  }

  merge(...channels: Channel[]): this {
    channels.forEach((channel) => {
      if (this.children.indexOf(channel) === -1) {
        this.children.push(channel);
        this.push(...channel.connections);
      }
    });
    return this;
  }

  refresh(): this {
    if (this.children.length) {
      this.connections = [];
      this.children.forEach((child) => this.push(...child.connections));
    }
    return this;
  }

  join(...connections: Connection[]): this {
    this.children.forEach((child) => child.join(...connections));
    connections.forEach(connection => this.push(connection));
    return this;
  }

  leave(...connections: Connection[]): this {
    this.children.forEach((child) => child.leave(...connections));
    connections.forEach(connection => {
      const index = this.connections.indexOf(connection);
      if (index !== -1) {
        this.connections.splice(index, 1);
      }
    });
    return this;
  }

  reset(): this {
    this.children.forEach((child) => child.reset());
    this.connections = [];
    this.children = [];
    return this;
  }

  send(eventName: string, data: any, fn?: FilterFn): this {
    let connections = fn ? this.connections.filter(fn) : this.connections;
    connections.forEach((current: Connection) => current.emit(eventName, data));
    return this;
  }

  private push(...connections: Connection[]): void {
    connections.forEach((connection) => {
      if (this.connections.indexOf(connection) === -1) {
        this.connections.push(connection);
      }
    });
  }
}