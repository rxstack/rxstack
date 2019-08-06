import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {DATA_FIXTURES_OPTIONS} from './DATA_FIXTURES_OPTIONS';
import {Injector} from 'injection-js';
import {FixtureManager, PURGER_SERVICE} from '../src';

const sinon = require('sinon');

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

  it('should get ordered fixtures', async () => {
    const fixtures = manager.getOrderedFixtures();
    fixtures[0].getName().should.be.equal('noop-fixture');
    fixtures[1].getName().should.be.equal('fixture-1');
    fixtures[2].getName().should.be.equal('fixture-2');
  });

  it('should register the fixtures', async () => {
    manager.all().length.should.be.equal(3);
  });

  it('should execute without purging', async () => {
    const spy = sinon.spy(injector.get(PURGER_SERVICE), 'purge');
    await manager.execute();
    spy.calledOnce.should.be.false;
    spy.restore();
  });

  it('should execute with purging', async () => {
    const spy = sinon.spy(injector.get(PURGER_SERVICE), 'purge');
    await manager.execute(true);
    spy.calledOnce.should.be.true;
    spy.restore();
  });

  it('should #addReference and #getReference in fixture service', async () => {
    manager.get('fixture-1').addReference('new-ref-1', 'val1');
    manager.get('fixture-2').getReference('new-ref-1').should.be.equal('val1');
  });
});
