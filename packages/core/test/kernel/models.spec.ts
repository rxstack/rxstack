import {Request} from '../../src/kernel/models/request';
import {HeaderBag} from '../../src/kernel/models/header-bag';
import {ParameterBag} from '../../src/kernel/models/parameter-bag';
import {AttributeBag} from '../../src/kernel/models/attribute-bag';
import {Response} from '../../src/kernel/models/response';

describe('Models', () => {
  it('should initialize request', async () => {
    const request = new Request('HTTP');
    request.transport.should.be.equal('HTTP');
    request.headers.should.be.instanceOf(HeaderBag);
    request.params.should.be.instanceOf(ParameterBag);
    request.attributes.should.be.instanceOf(AttributeBag);
  });

  it('should initialize response', async () => {
    const response = new Response('content');
    response.content.should.be.equal('content');
    response.statusCode.should.be.equal(200);
    response.headers.should.be.instanceOf(HeaderBag);
  });

  it('should import and export values from ParameterBag', async () => {
    const bag = new ParameterBag({'id': 1});
    JSON.stringify(bag.toObject()).should.be.equal(JSON.stringify({'id': 1}));
  });
});