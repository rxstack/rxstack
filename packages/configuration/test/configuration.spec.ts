import {describe, expect, it} from '@jest/globals';
import {environment} from './environments/environment';
import {configuration} from '../src';
const path = require('path');
const appRootPath = require('app-root-path').path;

describe('Configuration', () => {
  process.env.NODE_ENV = 'TESTING';
  process.env['MY_VALUE'] = 'my env value';
  configuration.initialize(appRootPath + '/test/environments', 'environment');

  it('should throw exception if directory does not exist', () => {
    const fn = () => {
      configuration.initialize('/unknown');
    };
    expect(fn).toThrow(new RegExp('Cannot find module'));
  });

  it('should get app dir', () => {
    expect(configuration.getRootPath()).toBe(path.resolve(appRootPath));
  });

  it('should override default configuration', () => {
    expect(environment.app.name).toBe('MyTestApp');
  });

  it('should normalize env variable', () => {
    expect(environment.app.env_value).toBe('my env value');
  });

  it('should normalize path variable', () => {
    expect(environment.app.dir).toBe(configuration.getRootPath() + '/my-dir');
  });

  it('should set empty array options', () => {
    expect(environment.app.opts2.length).toBe(0);
  });
});
