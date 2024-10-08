import {AbstractCommand} from '@rxstack/core';
import {Injectable} from 'injection-js';
import {FixtureManager} from './fixture.manager';

const winston = require('winston');

@Injectable()
export class LoadFixturesCommand extends AbstractCommand {
  command = 'data-fixtures:load';
  description = 'Load data fixtures';
  builder = {
    'purge': {
      'default': false
    }
  };

  async handler(yargs: any): Promise<void> {
    winston.debug('Fixtures loading is started.');
    const manager = this.injector.get(FixtureManager);
    await manager.execute(Boolean(yargs.purge));
    winston.debug('Fixtures have been successfully loaded.');
  }
}
