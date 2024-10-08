import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll, jest} from '@jest/globals';
import {Application} from '@rxstack/core';
import {DATA_FIXTURES_OPTIONS} from './DATA_FIXTURES_OPTIONS';
import {Injector} from 'injection-js';
import {FixtureManager, PURGER_SERVICE} from '../src';

describe('FixtureManager', () => {
  // Setup application
  const app = new Application(DATA_FIXTURES_OPTIONS);
  let injector: Injector;
  let manager: FixtureManager;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    manager = injector.get(FixtureManager);
  });

  afterAll(async() =>  {
    await app.stop();
  });

  it('should get ordered fixtures', async () => {
    const fixtures = manager.getOrderedFixtures();
    expect(fixtures[0].getName()).toBe('noop-fixture');
    expect(fixtures[1].getName()).toBe('fixture-1');
    expect(fixtures[2].getName()).toBe('fixture-2');
  });

  it('should register the fixtures', async () => {
    expect(manager.all().length).toBe(3);
  });

  it('should execute without purging', async () => {
    const spy = jest.spyOn(injector.get(PURGER_SERVICE), 'purge');
    await manager.execute();
    expect(spy).toHaveBeenCalledTimes(0);
    jest.restoreAllMocks();
  });

  it('should execute with purging', async () => {
    const spy = jest.spyOn(injector.get(PURGER_SERVICE), 'purge');
    await manager.execute(true);
    expect(spy).toHaveBeenCalledTimes(1);
    jest.restoreAllMocks();
  });

  it('should #addReference and #getReference in fixture service', async () => {
    manager.get('fixture-1').setReference('new-ref-1', 'val1');
    expect(manager.get('fixture-2').getReference('new-ref-1')).toBe('val1');
  });
});
