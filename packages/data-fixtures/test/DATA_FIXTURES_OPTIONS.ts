import {ApplicationOptions} from '@rxstack/core';
import {DataFixtureModule, FIXTURE_REGISTRY} from '../src';
import {FixtureTest1} from './mocks/fixture-test-1';
import {FixtureTest2} from './mocks/fixture-test-2';

export const DATA_FIXTURES_OPTIONS: ApplicationOptions = {
  imports: [
    DataFixtureModule
  ],
  providers: [
    { provide: FIXTURE_REGISTRY, useClass: FixtureTest1, multi: true },
    { provide: FIXTURE_REGISTRY, useClass: FixtureTest2, multi: true },
  ],
  logger: {
    handlers: [
      {
        type: 'console',
        options: {
          level: 'silly',
        }
      }
    ]
  }
};