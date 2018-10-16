import 'reflect-metadata';
import {MemoryService} from '../src/memory-service';
import {Product} from './mocks/product';
import {Matcher} from '../src/matcher';
import {Sorter} from '../src/sorter';
import {loader} from './mocks/loader';
import {NonUniqueResultException, MissingIdentifierException} from '@rxstack/platform';
import {DataContainer} from '../src/data-container';
import {data1} from './mocks/data';

describe('MemoryService:Impl', () => {
  // Setup
  const dataContainer = new DataContainer<Product>();
  const service = new MemoryService(dataContainer, Product, 'products', new Matcher(), new Sorter());

  beforeEach(async () => {
    await dataContainer.purge();
  });

  it('#createNew', async () => {
    const product = await service.createNew();
    product.should.be.instanceOf(Product);
    (typeof product.id).should.equal('string');
  });

  it('#save, #find and #remove', async () => {
    const product = await service.createNew();
    await service.save(product);
    const found = await service.find(product.id);
    found.id.should.be.equal(product.id);
    await service.remove(found);
    const result = await service.find(product.id);
    (undefined === result).should.be.equal(true);
  });

  it('#findMany', async () => {
    await loader(service, data1);
    const result = await service.findMany();
    result.length.should.be.equal(3);
  });

  it('#findMany with query', async () => {
    await loader(service, data1);
    const result = await service.findMany({'where': {'tags': {'$in': 'tag2'}}, limit: 10, skip: 0});
    result.length.should.be.equal(2);
  });

  it('#count', async () => {
    await loader(service, data1);
    const result = await service.count();
    result.should.be.equal(3);
  });

  it('#count with query', async () => {
    await loader(service, data1);
    const result = await service.count({'tags': {'$in': 'tag2'}});
    result.should.be.equal(2);
  });

  it('#findOne', async () => {
    await loader(service, data1);
    const result = await service.findOne({'name': {'$eq': 'name1'}});
    result.should.be.instanceOf(Product);
    result.name.should.be.equal('name1');
  });

  it('#findOne with NonUniqueResultException', async () => {
    await loader(service, data1);
    let exception;
    try {
      await service.findOne({'tags': {'$in': 'tag2'}});
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(NonUniqueResultException);
  });


  it('#save with MissingIdentifierException', async () => {
    const product = new Product();
    let exception;
    try {
      await service.save(product);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MissingIdentifierException);
  });

  it('#remove with MissingIdentifierException', async () => {
    const product = new Product();
    let exception;
    try {
      await service.remove(product);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MissingIdentifierException);
  });
});
