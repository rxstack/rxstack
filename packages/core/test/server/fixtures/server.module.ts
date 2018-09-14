import {Module} from '../../../src/application';
import {ConnectionListener} from './connection-listener';

@Module({
  providers: [
    { provide: ConnectionListener, useClass: ConnectionListener },
  ]
})
export class ServerModule { }