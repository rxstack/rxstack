import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll, jest} from '@jest/globals';
import {DATA_FIXTURES_OPTIONS} from './DATA_FIXTURES_OPTIONS';
import {Application, CommandManager} from '@rxstack/core';
import {Injector} from 'injection-js';
import {FixtureManager} from '../src';

describe('LoadFixturesCommand', () => {
  // Setup application
  const app = new Application(DATA_FIXTURES_OPTIONS);
  let injector: Injector;

  beforeAll(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  afterAll(async() =>  {
    await app.stop();
  });

  it('should execute command with purge', async () => {
    const spy = jest.spyOn(injector.get(FixtureManager), 'execute');
    const command = app.getInjector().get(CommandManager).getCommand('data-fixtures:load');
    await command.handler({purge: true});
    expect(spy).toBeCalledWith(true);
    jest.restoreAllMocks();
  });

  it('should execute command without purge', async () => {
    const spy = jest.spyOn(injector.get(FixtureManager), 'execute');
    const command = app.getInjector().get(CommandManager).getCommand('data-fixtures:load');
    await command.handler({purge: false});
    expect(spy).toBeCalledWith(false);
    jest.restoreAllMocks();
  });
});
