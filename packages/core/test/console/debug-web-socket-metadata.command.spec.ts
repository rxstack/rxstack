import 'reflect-metadata';
import {Application} from '../../src/application';
import {CONSOLE_APP_OPTIONS} from './fixtures/console-app-options';
import {CommandManager} from '../../src/console';

const sinon = require('sinon');

describe('Console:DebugWebSocketMetaDataCommand', () => {
  // Setup application
  const app = new Application(CONSOLE_APP_OPTIONS);
  let consoleSpy: any;

  before(async () => {
    await app.start();
    consoleSpy = sinon.spy(console, 'log');
  });

  after(async () => {
    consoleSpy.restore();
    app.stop();
  });

  it('should execute debug command', async () => {
    const command = app.getInjector().get(CommandManager).getCommand('debug:web-socket-metadata');
    await command.handler({});
    consoleSpy.called.should.be.true;
  });
});