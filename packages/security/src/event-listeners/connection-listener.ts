import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ConnectionEvent, ServerEvents} from '@rxstack/core';

@Injectable()
export class ConnectionListener {
  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: ConnectionEvent): Promise<void> {
    const connection: any = event.connection;
    if (connection['tokenTimeout']) {
      clearTimeout(connection['tokenTimeout']);
      connection['tokenTimeout'] = null;
    }
  }
}
