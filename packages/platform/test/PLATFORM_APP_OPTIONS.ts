import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule} from '../src';
import {environmentPlatform} from './environment.platform';
import {TaskService} from './mocks/task.service';
import {PatchTaskOperation} from './mocks/operations/patch-task.operation';
import {CreateTaskOperation} from './mocks/operations/create-task.operation';
import {BulkRemoveTaskOperation} from './mocks/operations/bulk-remove-task.operation';
import {GetTaskOperation} from './mocks/operations/get-task.operation';
import {UpdateTaskOperation} from './mocks/operations/update-task.operation';
import {RemoveTaskOperation} from './mocks/operations/remove-task.operation';
import {ListTaskOperation} from './mocks/operations/list-task.operation';
import {PaginatedListTaskOperation} from './mocks/operations/paginated-list-task.operation';
import {CustomTaskOperation} from './mocks/operations/custom-task.operation';

export const PLATFORM_APP_OPTIONS: ApplicationOptions = {
  imports: [
    PlatformModule
  ],
  providers: [
    { provide: TaskService, useClass: TaskService },
    { provide: CreateTaskOperation, useClass: CreateTaskOperation },
    { provide: GetTaskOperation, useClass: GetTaskOperation },
    { provide: UpdateTaskOperation, useClass: UpdateTaskOperation },
    { provide: RemoveTaskOperation, useClass: RemoveTaskOperation },
    { provide: ListTaskOperation, useClass: ListTaskOperation },
    { provide: PaginatedListTaskOperation, useClass: PaginatedListTaskOperation },
    { provide: PatchTaskOperation, useClass: PatchTaskOperation },
    { provide: BulkRemoveTaskOperation, useClass: BulkRemoveTaskOperation },
    { provide: CustomTaskOperation, useClass: CustomTaskOperation },
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};