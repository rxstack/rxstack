import {Request} from '../../src/kernel/models/request';
import {HeaderBag} from '../../src/kernel/models/header-bag';
import {ParameterBag} from '../../src/kernel/models/parameter-bag';
import {AttributeBag} from '../../src/kernel/models/attribute-bag';
import {FileBag} from '../../src/kernel/models/file-bag';
import {Response} from '../../src/kernel/models/response';
import {File} from '../../src/kernel/models/file';

describe('Models', () => {
  it('should initialize request', async () => {
    const request = new Request('HTTP');
    request.transport.should.be.equal('HTTP');
    request.headers.should.be.instanceOf(HeaderBag);
    request.params.should.be.instanceOf(ParameterBag);
    request.attributes.should.be.instanceOf(AttributeBag);
    request.files.should.be.instanceOf(FileBag);
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

  it('should initialize file', async () => {
    const filebag = new FileBag();
    filebag.fromObject({'file': {
      'name': 'file.txt',
      'size': 10,
      'type': 'text/plain',
      'path': 'path_to_file',
      'hash': 'hash',
    }});

    const file = filebag.get('file');

    file.name.should.be.equal('file.txt');
    file.size.should.be.equal(10);
    file.type.should.be.equal('text/plain');
    file.path.should.be.equal('path_to_file');
    file.hash.should.be.equal('hash');
  });

  it('should initialize file with no data', async () => {
    const file = new File();
    (file.name === null).should.be.true;
    (file.size === null).should.be.true;
    (file.type === null).should.be.true;
    (file.path === null).should.be.true;
    (file.hash === null).should.be.true;
  });
});