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
    const servers = Array.from(this.servers.values());
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      const definitions = server.getTransport() === 'HTTP'
        ? this.kernel.httpDefinitions : this.kernel.webSocketDefinitions;
      await server.start(definitions);
    }
  }

  async stop(): Promise<void> {
    const servers = Array.from(this.servers.values());
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      await server.stopEngine();
    }
  }

  getByName(name: string): AbstractServer {
    return this.servers.get(name);
  }
}