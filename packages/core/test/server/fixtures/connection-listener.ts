import {ServerEvents, ConnectionEvent} from '../../../src/server';
import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';

@Injectable()
export class ConnectionListener {
  connected = false;

  @Observe(ServerEvents.CONNECTED)
  async onConnect(event: ConnectionEvent): Promise<void> {
    this.connected = true;
  }
}