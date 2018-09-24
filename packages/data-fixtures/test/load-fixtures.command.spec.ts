import 'reflect-metadata';
import {DATA_FIXTURES_OPTIONS} from './DATA_FIXTURES_OPTIONS';
import {Application, CommandManager} from '@rxstack/core';
import {Injector} from 'injection-js';
import {FixtureManager} from '../src';

const sinon = require('sinon');

describe('LoadFixturesCommand', () => {
  // Setup application
  const app = new Application(DATA_FIXTURES_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should execute command with purge', async () => {
    const spy = sinon.spy(injector.get(FixtureManager), 'execute');
    const command = app.getInjector().get(CommandManager).getCommand('data-fixtures:load');
    await command.handler({purge: true});
    spy.getCall(0).args[0].should.be.equal(true);
    spy.restore();
  });

  it('should execute command without purge', async () => {
    const spy = sinon.spy(injector.get(FixtureManager), 'execute');
    const command = app.getInjector().get(CommandManager).getCommand('data-fixtures:load');
    await command.handler({purge: false});
    spy.getCall(0).args[0].should.be.equal(false);
    spy.restore();
  });
});