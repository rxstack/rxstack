import {formatFunc} from '../../src/logger/utils';

describe('Utils', () => {
  it('should format log', () => {
    const info = {
      level: 'error',
      message: 'some error',
      timestamp: new Date().toISOString()
    };
    const result = formatFunc(info);
    (result.includes('[error]: some error'));
  });

  it('should format log with source and meta info', () => {
    const info = {
      level: 'error',
      message: 'some error',
      timestamp: new Date().toISOString(),
      source: 'TestSource',
      prop: 'some value'
    };
    const result = formatFunc(info);
    (result.includes('TestSource'));
    (result.includes('some value'));
  });
});
