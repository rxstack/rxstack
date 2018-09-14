import {Channel} from './channel';

export class ChannelManager {
  private stack: Map<string, Channel> = new Map();

  channels(...names: string[]): Channel {
    const channel = this.channel(names.join('_'));
    names.forEach((name: string) => channel.merge(this.channel(name)));
    return channel;
  }

  channel(name: string): Channel {
    if (!this.hasChannel(name)) {
      this.stack.set(name, new Channel(name));
    }
    return this.stack.get(name);
  }

  hasChannel(name: string): boolean {
    return this.stack.has(name);
  }

  removeChannel(name: string): void {
    this.stack.delete(name);
  }

  reset(): void {
    this.stack.clear();
  }
}