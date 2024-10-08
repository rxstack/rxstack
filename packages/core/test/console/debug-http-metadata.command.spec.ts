import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll, jest} from '@jest/globals';
import {Application} from '../../src/application';
import {CONSOLE_APP_OPTIONS} from './fixtures/console-app-options';
import {CommandManager} from '../../src/console';

describe('Console:DebugHttpMetaDataCommand', () => {
  // Setup application
  const app = new Application(CONSOLE_APP_OPTIONS);
  let consoleSpy: any;

  beforeAll(async () => {
    await app.cli();
    consoleSpy = jest.spyOn(console, 'log');
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.stop();
  }, 1000);

  it('should execute debug command', async () => {
    const command = app.getInjector().get(CommandManager).getCommand('debug:http-metadata');
    await command.handler({});
    expect(consoleSpy).toHaveBeenCalled();
  });
});
