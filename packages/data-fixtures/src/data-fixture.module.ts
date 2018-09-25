import {COMMAND_REGISTRY, Logger, Module} from '@rxstack/core';
import {FIXTURE_REGISTRY, PURGER_SERVICE, PurgerInterface} from './interfaces';
import {NoopPurger} from './noop-purger';
import {FixtureManager} from './fixture.manager';
import {AbstractFixture} from './abstract-fixture';
import {ReferenceRepository} from './reference-repository';
import {NoopFixture} from './noop-fixture';
import {LoadFixturesCommand} from './load-fixtures.command';

@Module({
  providers: [
    { provide: ReferenceRepository, useClass: ReferenceRepository },
    {
      provide: FixtureManager,
      useFactory: (purger: PurgerInterface, registry: AbstractFixture[], logger: Logger) => {
        return new FixtureManager(registry, purger, logger);
      },
      deps: [PURGER_SERVICE, FIXTURE_REGISTRY, Logger]
    },
    { provide: FIXTURE_REGISTRY, useClass: NoopFixture, multi: true },
    { provide: PURGER_SERVICE, useClass: NoopPurger },
    { provide: COMMAND_REGISTRY, useClass: LoadFixturesCommand, multi: true },
  ]
})
export class DataFixtureModule { }