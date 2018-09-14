import 'reflect-metadata';
import {ConsoleTestTransport} from './fixtures/console-test.transport';
import * as _ from 'lodash';
import {Logger} from '../../src/logger';
import {Exception} from '@rxstack/exceptions';
const stdMocks = require('std-mocks');

describe('Logger', () => {

  const logger = new Logger([new ConsoleTestTransport()], [
    {
      type: 'console.test',
      options: {
        level: 'silly',
      }
    }
  ]);

  it('should output error without source', () => {
    stdMocks.use();
    logger.error('some error');
    stdMocks.restore();

    const output = stdMocks.flush();
    const consoleOutput = output.stdout.pop();
    consoleOutput.includes('some error').should.be.true;
  });

  it('should output debug with source', () => {
    stdMocks.use();
    logger.debug('another error', {'prop': 'my prop', 'source': 'TestSource'});
    stdMocks.restore();

    const output = stdMocks.flush();
    const consoleOutput = output.stdout.pop();
    consoleOutput.includes('[TestSource]').should.be.true;
    consoleOutput.includes('another error').should.be.true;
    consoleOutput.includes('my prop').should.be.true;
  });

  it('should output message type', () => {
    const types: string[] = ['info', 'warning', 'verbose', 'silly'];

    stdMocks.use();
    types.forEach((type) => {
      logger[type](type);
    });
    stdMocks.restore();
    const output = stdMocks.flush();

    _.forEach(output.stdout, (message: string, i: number) => {
      message.includes(types[i]).should.be.true;
    });
  });

  it('should throw an exception if transport does not exist', () => {
    let exception: Exception;
    try {
      new Logger([new ConsoleTestTransport()], [
        {
          type: 'none',
          options: {
            level: 'silly',
          }
        }
      ]);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(Exception);
  });

  it('should throw an exception if transport is already registered', () => {
    let exception: Exception;
    try {
      new Logger([new ConsoleTestTransport(), new ConsoleTestTransport()], [
        {
          type: 'console.test',
          options: {
            level: 'silly',
          }
        }
      ]);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(Exception);
  });
});
