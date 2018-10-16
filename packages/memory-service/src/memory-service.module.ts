import {Module} from '@rxstack/core';
import {DataContainer} from './data-container';
import {MATCHER_TOKEN, SORTER_TOKEN} from './interfaces';
import {Matcher} from './matcher';
import {Sorter} from './sorter';

@Module({
  providers: [
    { provide: DataContainer, useClass: DataContainer },
    { provide: MATCHER_TOKEN, useClass: Matcher },
    { provide: SORTER_TOKEN, useClass: Sorter },
  ]
})
export class MemoryServiceModule { }