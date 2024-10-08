import 'reflect-metadata';
import {describe, expect, it, afterAll} from '@jest/globals';
import {Application} from '../../src/application';
import {CommandManager} from '../../src/console';
import {CONSOLE_APP_OPTIONS} from './fixtures/console-app-options';
const stdMocks = require('std-mocks');

describe('CommandManager', () => {
  // Setup application
  process.argv = ['testing', '-s', 'hello'];
  const app = new Application(CONSOLE_APP_OPTIONS);

  it('should register and execute testing command', async () => {
    stdMocks.use();
    await app.cli();
    stdMocks.restore();
    const output = stdMocks.flush();
    const consoleOutput = output.stdout.pop();
    expect(consoleOutput.includes('hello')).toBeTruthy();
    expect(app.getInjector().get(CommandManager).commands.length).toBe(3);
  });

  afterAll(async () => {
    await app.stop();
  }, 1000);
});
