import {Injectable} from 'injection-js';

@Injectable()
export class NoopPurger {
  async purge(): Promise<void> { }
}