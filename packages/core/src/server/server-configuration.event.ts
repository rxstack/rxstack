import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {AbstractServer} from './abstract-server';

export class ServerConfigurationEvent extends GenericEvent {
  constructor(public readonly server: AbstractServer) {
    super();
  }
}