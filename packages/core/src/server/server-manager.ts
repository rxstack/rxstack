import {AbstractServer} from './abstract-server';
import {Injectable} from 'injection-js';
import {Kernel} from '../kernel';

@Injectable()
export class ServerManager {
  servers: Map<string, AbstractServer> = new Map();

  constructor(registry: AbstractServer[], private kernel: Kernel, enabledServers: string[]) {
    registry.forEach((server) => {
      if (enabledServers.findIndex((value) => value === server.getName()) > -1) {
        this.servers.set(server.getName(), server);
      }
    });
  }

  async start(): Promise<void> {
    Array.from(this.servers.values()).reduce(async (current: Promise<void>, server: AbstractServer): Promise<void> => {
      current.then(async () => {
        const definitions = server.getTransport() === 'HTTP'
          ? this.kernel.httpDefinitions : this.kernel.webSocketDefinitions;
        await server.start(definitions);
      });
    }, Promise.resolve(null));
  }

  async stop(): Promise<void> {
    const promises: Promise<void>[] = [];
    Array.from(this.servers.values()).forEach((server) => promises.push(server.stopEngine()));
    await Promise.all(promises);
  }

  getByName(name: string): AbstractServer {
    return this.servers.get(name);
  }
}