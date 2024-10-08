import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll} from '@jest/globals';
import {Application} from '@rxstack/core';
import {DATA_FIXTURES_OPTIONS} from './DATA_FIXTURES_OPTIONS';
import {Injector} from 'injection-js';
import {ReferenceRepository} from '../src';

describe('ReferenceRepository', () => {
  // Setup application
  const app = new Application(DATA_FIXTURES_OPTIONS);
  let injector: Injector;
  let repository: ReferenceRepository;

  beforeAll(async() =>  {
    await app.start();
    injector = app.getInjector();
    repository = injector.get(ReferenceRepository);
  });

  afterAll(async() =>  {
    await app.stop();
  });

  it('should #setReference', async () => {
    repository.setReference('ref1', 'val1');
    expect(repository.hasReference('ref1')).toBeTruthy();
  });

  it('should #getReference', async () => {
    repository.setReference('ref3', 'val3');
    expect(repository.getReference('ref3')).toBe('val3');
  });

  it('should throw an exception on #getReference', async () => {
    repository.reset();
    const func = () => {
      repository.getReference('none');
    };
    expect(func).toThrow();
  });
});
