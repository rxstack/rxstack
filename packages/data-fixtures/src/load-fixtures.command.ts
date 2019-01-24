import {AbstractCommand, Logger} from '@rxstack/core';
import {Injectable} from 'injection-js';
import {FixtureManager} from './fixture.manager';

@Injectable()
export class LoadFixturesCommand extends AbstractCommand {
  command = 'data-fixtures:load';
  description = 'Load data fixtures';
  builder = (yargs: any) => yargs.default('purge', 'false');

  async handler(yargs: any): Promise<void> {
    this.injector.get(Logger).debug('Fixtures loading is started.', {source: 'data-fixtures'});
    const manager = this.injector.get(FixtureManager);
    await manager.execute(Boolean(yargs.purge));
    this.injector.get(Logger).debug('Fixtures have been successfully loaded.', {source: 'data-fixtures'});
  }
}