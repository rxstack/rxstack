import {Injectable} from 'injection-js';
import {PurgerInterface} from '@rxstack/data-fixtures';
import {DataContainer} from './data-container';

@Injectable()
export class MemoryPurger implements PurgerInterface {

  constructor(private dataContainer: DataContainer<any>) { }

  async purge(): Promise<void> {
    await this.dataContainer.purge();
  }
}