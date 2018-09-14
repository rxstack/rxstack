import 'reflect-metadata';
const yargs = require('yargs');
import {Application} from '../../src/application';
import {CommandManager} from '../../src/console';
import {CONSOLE_APP_OPTIONS} from './fixtures/console-app-options';
const stdMocks = require('std-mocks');

describe('CommandManager', () => {
  // Setup application
  yargs(['testing']).option('s', {
    type: 'string',
    default: 'hello'
  });
  const app = new Application(CONSOLE_APP_OPTIONS);

  it('should register and execute testing command', async () => {
    stdMocks.use();
    await app.start();
    stdMocks.restore();
    const output = stdMocks.flush();
    const consoleOutput = output.stdout.pop();
    consoleOutput.includes('hello').should.be.true;
    app.getInjector().get(CommandManager).commands.length.should.be.equal(3);
    app.stop();
  });

});