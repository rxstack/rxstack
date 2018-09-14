import {Injectable} from 'injection-js';
import {AbstractCommand} from '../../../src/console';
const yargs = require('yargs');

@Injectable()
export class TestCommand extends AbstractCommand {

  command = 'testing';
  describe = 'Test command.';

  builder(): any {
    return yargs
      .option('s', {
        alias: 'something',
        describe: 'Some description.'
      });
  }

  async handler(argv: any) {
    console.log(argv.s);
  }
}