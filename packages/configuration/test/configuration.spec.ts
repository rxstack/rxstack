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
    fn.should.throw(new RegExp('Cannot find module'));
  });

  it('should get app dir', () => {
    configuration.getRootPath().should.equal(path.resolve(appRootPath));
  });

  it('should override default configuration', () => {
    environment.app.name.should.equal('MyTestApp');
  });

  it('should normalize env variable', () => {
    environment.app.env_value.should.equal('my env value');
  });

  it('should normalize path variable', () => {
    environment.app.dir.should.equal(configuration.getRootPath() + '/my-dir');
  });

  it('should set empty array options', () => {
    environment.app.opts2.length.should.equal(0);
  });
});