import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {MEMORY_SERVICE_OPTIONS, PRODUCT_SERVICE} from './mocks/MEMORY_SERVICE_OPTIONS';
import {DataContainer, Matcher, MATCHER_TOKEN, MemoryService, Sorter, SORTER_TOKEN} from '../src';

describe('MemoryService:MemoryServiceModule', () => {
  // Setup application
  const app = new Application(MEMORY_SERVICE_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('#PRODUCT_SERVICE', () => {
    injector.get(PRODUCT_SERVICE).should.be.instanceOf(MemoryService);
  });

  it('#MATCHER_TOKEN', () => {
    injector.get(MATCHER_TOKEN).should.be.instanceOf(Matcher);
  });

  it('#SORTER_TOKEN', () => {
    injector.get(SORTER_TOKEN).should.be.instanceOf(Sorter);
  });

  it('#DataContainer', () => {
    injector.get(DataContainer).should.be.instanceOf(DataContainer);
  });
});
