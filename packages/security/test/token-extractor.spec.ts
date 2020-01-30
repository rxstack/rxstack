import 'reflect-metadata';
import {Injector} from 'injection-js';
import {TokenExtractorManager} from '../src/token-extractors/token-extractor-manager';
import {QueryParameterTokenExtractor} from '../src/token-extractors/query-parameter-token-extractor';
import {Application, Request} from '@rxstack/core';
import {SECURITY_APP_OPTIONS} from './mocks/security-app-options';

describe('Security:TokenExtractors', () => {
  // Setup application
  const app = new Application(SECURITY_APP_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.run();
    injector = app.getInjector();
  });

  it('should get extractor by name', async () => {
    const manager = injector.get(TokenExtractorManager);
    manager.get(QueryParameterTokenExtractor.EXTRACTOR_NAME)
      .should.be.instanceOf(QueryParameterTokenExtractor);
  });

  describe('QueryParameterTokenExtractor', () => {
    it('should extract token from query', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.params.set('bearer', 'generated-token');
      manager.extract(request).should.be.equal('generated-token');
    });

    it('should not extract the token', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.params.set('some', 'generated-token');
      (manager.extract(request) === null).should.be.equal(true);
    });
  });

  describe('HeaderTokenExtractor', () => {
    it('should extract token from headers', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.headers.set('authorization', 'Bearer generated-token');
      manager.extract(request).should.be.equal('generated-token');
    });

    it('should not extract the token', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.headers.set('some', 'generated-token');
      (manager.extract(request) === null).should.be.equal(true);
    });

    it('should not extract the token if prefix is not found', async () => {
      const manager = injector.get(TokenExtractorManager);

      const request = new Request('HTTP');
      request.headers.set('authorization', 'generated-token');
      (manager.extract(request) === null).should.be.equal(true);
    });
  });
});
