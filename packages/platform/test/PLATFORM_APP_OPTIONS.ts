import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule} from '../src/platform.module';
import {environmentPlatform} from './environment.platform';
import {TaskService} from './mocks/task.service';
import {GetTaskOperation} from './mocks/operations-get/get-task.operation';
import {TaskModel} from './mocks/task.model';
import {GetTaskWithPreReadOperation} from './mocks/operations-get/get-task-with-pre-read.operation';
import {GetTaskWithPostReadOperation} from './mocks/operations-get/get-task-with-post-read.operation';

export const PLATFORM_APP_OPTIONS: ApplicationOptions = {
  imports: [
    PlatformModule.configure()
  ],
  providers: [
    {
      provide: TaskService,
      useFactory: () => {
        return new TaskService<TaskModel>(TaskModel);
      },
      deps: []
    },
    { provide: GetTaskOperation, useClass: GetTaskOperation },
    { provide: GetTaskWithPreReadOperation, useClass: GetTaskWithPreReadOperation },
    { provide: GetTaskWithPostReadOperation, useClass: GetTaskWithPostReadOperation },
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};