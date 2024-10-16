import {describe, expect, it} from '@jest/globals';
import {config} from './env/config';
import {configuration} from '../src';

const appRootPath = require('app-root-path').path;

describe('Configuration with default env', () => {
  delete process.env.NODE_ENV;
  configuration.initialize(appRootPath + '/test/env', 'config');

  it('should initialize if environment file does not exist', () => {
    expect(config.app.name).toBe('MyDevApp');
  });
});
