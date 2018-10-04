import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule} from '../src/platform.module';
import {environmentPlatform} from './environment.platform';
import {TaskService} from './mocks/task.service';
import {GetTaskOperation} from './mocks/operations-get/get-task.operation';
import {TaskModel} from './mocks/task.model';
import {GetTaskWithPreReadOperation} from './mocks/operations-get/get-task-with-pre-read.operation';
import {GetTaskWithPostReadOperation} from './mocks/operations-get/get-task-with-post-read.operation';
import {ListTaskOperation} from './mocks/operation-list/list-task.operation';
import {ListTaskWithPaginationOperation} from './mocks/operation-list/list-task-with-pagination.operation';
import {ListTaskWithQueryOperation} from './mocks/operation-list/list-task-with-query.operation';
import {ListTaskOperationWithPreRead} from './mocks/operation-list/list-task.operation-with-pre-read';
import {ListTaskWithOnQueryOperation} from './mocks/operation-list/list-task-with-on-query.operation';

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
    { provide: ListTaskOperation, useClass: ListTaskOperation },
    { provide: ListTaskWithPaginationOperation, useClass: ListTaskWithPaginationOperation },
    { provide: ListTaskWithQueryOperation, useClass: ListTaskWithQueryOperation },
    { provide: ListTaskOperationWithPreRead, useClass: ListTaskOperationWithPreRead },
    { provide: ListTaskWithOnQueryOperation, useClass: ListTaskWithOnQueryOperation },
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};