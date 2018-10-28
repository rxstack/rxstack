import 'reflect-metadata';
import {MemoryService} from '../src/memory-service';
import {Product} from './mocks/product';
import {loader} from './mocks/loader';
import {data1} from './mocks/data';
import {BadRequestException, Exception} from '../../exceptions/src';
import * as _ from 'lodash';
import {Application} from '../../core';
import {MEMORY_SERVICE_OPTIONS, PRODUCT_SERVICE} from './mocks/MEMORY_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {MemoryPurger} from '../src/memory-purger';

describe('MemoryService:Impl', () => {
  // Setup application
  const app = new Application(MEMORY_SERVICE_OPTIONS);
  let injector: Injector;
  let service: MemoryService<Product>;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    service = injector.get(PRODUCT_SERVICE);
  });

  after(async() =>  {
    await app.stop();
  });

  beforeEach(async () => {
    await injector.get(MemoryPurger).purge();
  });

  it('#create', async () => {
    const data = _.omit(data1[0], 'id');
    const product = await service.create(data);
    (typeof product.id).should.equal('string');
  });

  it('#create should throw an exception if record exists', async () => {
    const data = _.cloneDeep(data1[0]);
    const product = await service.create(data);
    product.id.should.equal('product-1');
    let exception: Exception;
    try {
      await service.create(data);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });

  it('#replace', async () => {
    await loader(service, _.cloneDeep(data1));
    const result = await service.replace('product-1', Object.assign(_.cloneDeep(data1[0]) ,{
      'name': 'replaced'
    }));
    result.id.should.be.equal('product-1');
    result.name.should.be.equal('replaced');
  });

  it('#patch should throw an exception if record does not exist', async () => {
    let exception: Exception;
    try {
      await service.patch('unknown', {});
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadRequestException);
  });

  it('#patch', async () => {
    await loader(service, _.cloneDeep(data1));
    const result = await service.patch('product-1', {
      'name': 'patched'
    });
    result.id.should.be.equal('product-1');
    result.name.should.be.equal('patched');
  });

  it('#remove', async () => {
    await loader(service, _.cloneDeep(data1));
    await service.remove('product-1');
    const result = await service.findOneById('product-1');
    (!!result).should.be.equal(false);
  });

  it('#findMany', async () => {
    await loader(service, data1);
    const result = await service.findMany();
    result.length.should.be.equal(3);
  });
  //
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
    result.name.should.be.equal('name1');
  });

  it('#findOne with sort', async () => {
    await loader(service, data1);
    const result = await service.findOne({}, {'price': -1});
    result.name.should.be.equal('name3');
  });
});
