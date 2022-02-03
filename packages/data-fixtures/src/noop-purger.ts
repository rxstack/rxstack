import {Injectable} from 'injection-js';
import {PurgerInterface} from './interfaces';

@Injectable()
export class NoopPurger implements PurgerInterface {
  async purge(): Promise<void> {
    // do nothing
  }
}
