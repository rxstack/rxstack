import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {EventEmitter} from 'events';
import {AbstractServer} from './abstract-server';

export class ConnectionEvent extends GenericEvent {
  constructor(public connection: EventEmitter, public readonly server: AbstractServer) {
    super();
  }
}