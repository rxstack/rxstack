import {Module} from '@rxstack/core';
import {ResourceListener} from './event-listeners';

@Module({
  providers: [
    { provide: ResourceListener, useClass: ResourceListener },
  ]
})
export class PlatformModule { }