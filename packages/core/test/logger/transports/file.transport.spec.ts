import 'reflect-metadata';
import {FileTransport} from '../../../src/logger/transports';
const winston = require('winston');
const fs = require('fs-extra');
const filename = __dirname + '/../../tmp/app.log';

describe('FileTransport', () => {
  const transport = new FileTransport();
  const options = {
    level: 'debug',
    filename: filename
  };
  transport.applyOptions(options);
  const instance = transport.createInstance(options);

  before(async () => {
    winston.add(instance);
  });

  after(async () => {
    winston.clear();
    fs.removeSync(filename);
  });

  it('should match the name', () => {
    transport.getName().should.be.equal(FileTransport.transportName);
  });

  it('should output message', () => {
    winston.error('file transport error');
    const data = fs.readJsonSync(filename, 'utf8');
    data.message.should.be.equal('\tfile transport error');
    data.level.should.be.equal('error');
  });

});
