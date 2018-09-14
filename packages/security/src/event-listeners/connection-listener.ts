import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ConnectionEvent, ServerEvents} from '@rxstack/core';

@Injectable()
export class ConnectionListener {
  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: ConnectionEvent): Promise<void> {
    if (event.connection['tokenTimeout']) {
      clearTimeout(event.connection['tokenTimeout']);
      event.connection['tokenTimeout'] = null;
    }
  }
}
