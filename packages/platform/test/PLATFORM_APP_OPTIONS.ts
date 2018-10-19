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
import {CreateTaskOperation} from './mocks/operation-write/create-task.operation';
import {UpdateTaskOperation} from './mocks/operation-write/update-task.operation';
import {CreateTaskWithPreSetDataOperation} from './mocks/operation-write/create-task-with-pre-set-data.operation';
import {CreateTaskWithPostSetDataOperation} from './mocks/operation-write/create-task-with-post-set-data.operation';
import {CreateTaskWithPreWriteOperation} from './mocks/operation-write/create-task-with-pre-write.operation';
import {CreateTaskWithPostWriteOperation} from './mocks/operation-write/create-task-with-post-write.operation';
import {RemoveTaskOperation} from './mocks/operation-remove/remove-task.operation';
import {RemoveTaskWithPreRemoveOperation} from './mocks/operation-remove/remove-task-with-pre-remove.operation';
import {RemoveTaskWithPostRemoveOperation} from './mocks/operation-remove/remove-task-with-post-remove.operation';
import {GetTaskWithResponseOperation} from './mocks/operations-get/get-task-with-response.operation';
import {ListTaskOperationWithResponse} from './mocks/operation-list/list-task.operation-with-response';
import {RemoveTaskWithResponseOperation} from './mocks/operation-remove/remove-task-with-response.operation';
import {CreateTaskWithResponseOperation} from './mocks/operation-write/create-task-with-response.operation';

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
    { provide: GetTaskWithResponseOperation, useClass: GetTaskWithResponseOperation },
    { provide: ListTaskOperation, useClass: ListTaskOperation },
    { provide: ListTaskWithPaginationOperation, useClass: ListTaskWithPaginationOperation },
    { provide: ListTaskWithQueryOperation, useClass: ListTaskWithQueryOperation },
    { provide: ListTaskOperationWithPreRead, useClass: ListTaskOperationWithPreRead },
    { provide: ListTaskWithOnQueryOperation, useClass: ListTaskWithOnQueryOperation },
    { provide: ListTaskOperationWithResponse, useClass: ListTaskOperationWithResponse },
    { provide: CreateTaskOperation, useClass: CreateTaskOperation },
    { provide: UpdateTaskOperation, useClass: UpdateTaskOperation },
    { provide: CreateTaskWithPreSetDataOperation, useClass: CreateTaskWithPreSetDataOperation },
    { provide: CreateTaskWithPostSetDataOperation, useClass: CreateTaskWithPostSetDataOperation },
    { provide: CreateTaskWithPreWriteOperation, useClass: CreateTaskWithPreWriteOperation },
    { provide: CreateTaskWithPostWriteOperation, useClass: CreateTaskWithPostWriteOperation },
    { provide: CreateTaskWithResponseOperation, useClass: CreateTaskWithResponseOperation },
    { provide: RemoveTaskOperation, useClass: RemoveTaskOperation },
    { provide: RemoveTaskWithPreRemoveOperation, useClass: RemoveTaskWithPreRemoveOperation },
    { provide: RemoveTaskWithPostRemoveOperation, useClass: RemoveTaskWithPostRemoveOperation },
    { provide: RemoveTaskWithResponseOperation, useClass: RemoveTaskWithResponseOperation },
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};