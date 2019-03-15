import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Kernel} from '../kernel';
import {AbstractServer, SERVER_REGISTRY, ServerManager} from '../server';
import {ConsoleTransport, FileTransport} from '../logger/transports';
import {Logger, LOGGER_TRANSPORT_REGISTRY} from '../logger';
import {Provider} from 'injection-js';
import {ApplicationOptions} from './application-options';
import {LoggerTransportInterface} from '../logger/interfaces';
import {NoopHttpServer} from '../server/noop-http.server';
import {NoopWebsocketServer} from '../server/noop-websocket.server';
import {COMMAND_REGISTRY, CommandManager, DebugHttpMetadataCommand} from '../console';
import {AbstractCommand} from '../console/abstract-command';
import {DebugWebSocketMetadataCommand} from '../console/debug-web-socket-metadata.command';

const LOGGER_PROVIDERS = function (options: ApplicationOptions): Provider[] {
  return [
    { provide: LOGGER_TRANSPORT_REGISTRY, useClass: FileTransport, multi: true },
    { provide: LOGGER_TRANSPORT_REGISTRY, useClass: ConsoleTransport, multi: true },
    {
      provide: Logger,
      useFactory: (registry: LoggerTransportInterface[]) => {
        return new Logger(registry, options.logger.handlers);
      },
      deps: [LOGGER_TRANSPORT_REGISTRY]
    }
  ];
};

const SERVER_PROVIDERS = function (options: ApplicationOptions): Provider[] {
  return [
    { provide: SERVER_REGISTRY, useClass: NoopHttpServer, multi: true },
    { provide: SERVER_REGISTRY, useClass: NoopWebsocketServer, multi: true },
    {
      provide: ServerManager,
      useFactory: (registry: AbstractServer[], kernel: Kernel) => {
        return new ServerManager(registry, kernel, options.servers);
      },
      deps: [SERVER_REGISTRY, Kernel]
    }
  ];
};

const COMMAND_PROVIDERS = function (options: ApplicationOptions): Provider[] {
  return [
    { provide: COMMAND_REGISTRY, useClass: DebugHttpMetadataCommand, multi: true },
    { provide: COMMAND_REGISTRY, useClass: DebugWebSocketMetadataCommand, multi: true },
    {
      provide: CommandManager,
      useFactory: (registry: AbstractCommand[]) => {
        return new CommandManager(registry);
      },
      deps: [COMMAND_REGISTRY]
    }
  ];
};

export const CORE_PROVIDERS = function (options: ApplicationOptions): Provider[]  {
  return [
    { provide: AsyncEventDispatcher, useClass: AsyncEventDispatcher},
    { provide: Kernel, useClass: Kernel },
    ...LOGGER_PROVIDERS(options),
    ...SERVER_PROVIDERS(options),
    ...COMMAND_PROVIDERS(options),
  ];
};