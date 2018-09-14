import 'reflect-metadata';
import {ConsoleTransport} from '../../../src/logger/transports';
const winston = require('winston');
const stdMocks = require('std-mocks');

describe('ConsoleTransport', () => {
  const transport = new ConsoleTransport();
  const options = {
    level: 'debug',
  };
  transport.applyOptions(options);
  const instance = transport.createInstance(options);

  before(async () => {
    winston.add(instance);
  });

  after(async () => {
    winston.clear();
  });

  it('should match the name', () => {
    transport.getName().should.be.equal(ConsoleTransport.transportName);
  });

  it('should output message', () => {
    stdMocks.use();
    winston.error('console error');
    stdMocks.restore();

    const output = stdMocks.flush(); console.log(output);
    const consoleOutput = output.stdout.pop();
    consoleOutput.includes('console error').should.be.true;
  });

});
