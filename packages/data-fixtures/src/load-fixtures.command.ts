import {AbstractCommand} from '@rxstack/core';
import {Injectable} from 'injection-js';
import {FixtureManager} from './fixture.manager';

@Injectable()
export class LoadFixturesCommand extends AbstractCommand {
  command = 'data-fixtures:load';
  description = 'Load data fixtures';
  builder = (yargs: any) => yargs.default('purge', 'false');

  async handler(yargs: any): Promise<void> {
    await this.injector.get(FixtureManager).execute(yargs.purge);
  }
}