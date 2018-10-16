import 'reflect-metadata';
import {DataContainer} from '../src';

describe('MemoryService:DataContainer', () => {
  // Setup
  const container = new DataContainer();

  it('#getCollection', () => {
    container.getCollection('name').should.be.instanceOf(Map);
  });

  it('#count', () => {
    container.count().should.be.equal(1);
  });

  it('#purge', async () => {
    await container.purge();
    container.count().should.be.equal(0);
  });
});
