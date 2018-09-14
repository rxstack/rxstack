import {MockService} from './mock.service';
import {ServiceRegistry} from '../src';

describe('Registry', () => {
  let registry = new ServiceRegistry();
  const service = new MockService();

  it('should register service and retrieve it', async () => {
      registry.register(service);
      registry.get(service.getName()).should.be.instanceOf(MockService);
  });

  it('should fetch all services', async () => {
    registry.all().length.should.be.equal(1);
  });

  it('should throw ExistingServiceException when register an existing service', async () => {
    const fn = () => {
      registry.register(service);
    };
    fn.should.throw();
  });

  it('should throw NonExistingServiceException', async () => {
    const fn = () => {
      registry.get('non-existing');
    };
    fn.should.throw();
  });

  it('should unregister service', async () => {
    registry.unregister(service.getName());
    registry.has(service.getName()).should.be.false;
  });

  it('should throw NonExistingServiceException when unregister', async () => {
    const fn = () => {
      registry.unregister(service.getName());
    };
    fn.should.throw();
  });

  it('should register services in the constructor', async () => {
    registry = new ServiceRegistry([service, service]);
    registry.all().length.should.be.equal(1);
  });

  it('should reset all services', async () => {
    registry.reset();
    registry.all().length.should.be.equal(0);
  });
});