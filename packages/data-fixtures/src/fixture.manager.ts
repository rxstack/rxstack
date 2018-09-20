import {ServiceRegistry} from '@rxstack/service-registry';
import {AbstractFixture} from './abstract-fixture';
import {Injectable} from 'injection-js';
import {PurgerInterface} from './interfaces';

@Injectable()
export class FixtureManager extends ServiceRegistry<AbstractFixture> {

  constructor(registry: AbstractFixture[], private purger: PurgerInterface) {
    super(registry);
  }

  async execute(purge = false): Promise<void> {
    if (purge) {
      await this.purger.purge();
    }
    return this.getOrderedFixtures().reduce(
      async (current: Promise<AbstractFixture>, fixture: AbstractFixture): Promise<void> => {
        await fixture.load();
      }, Promise.resolve(null));
  }

  getOrderedFixtures(): AbstractFixture[] {
    return this.all().sort((a: AbstractFixture , b: AbstractFixture) => a.getOrder() - b.getOrder());
  }
}