import {Module} from '@rxstack/core';
import {ApiResourceListener} from './event-listeners';

@Module({
  providers: [
    { provide: ApiResourceListener, useClass: ApiResourceListener },
  ]
})
export class PlatformModule { }