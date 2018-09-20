import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {DATA_FIXTURES_OPTIONS} from './DATA_FIXTURES_OPTIONS';
import {Injector} from 'injection-js';
import {FixtureManager} from '../src';

describe('FixtureManager', () => {
  // Setup application
  const app = new Application(DATA_FIXTURES_OPTIONS);
  let injector: Injector;
  let manager: FixtureManager;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    manager = injector.get(FixtureManager);
  });

  after(async() =>  {
    await app.stop();
  });

  it('do test', async () => {
    await manager.execute(true);
  });

});
