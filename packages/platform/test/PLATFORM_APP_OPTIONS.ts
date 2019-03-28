import {ApplicationOptions} from '@rxstack/core';
import {PlatformModule, UserProvider} from '../src';
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
import {BulkCreateTaskOperation} from './mocks/operations/bulk-create-task.operation';
import {UserService} from './mocks/user.service';
import {RefreshTokenInterface, User} from '@rxstack/security';
import {RefreshTokenManager} from '../src/add-ons';
import {RefreshTokenService} from './mocks/refresh-token.service';
import {MockTokenManager} from './mocks/mock.token-manager';

export const PLATFORM_APP_OPTIONS: ApplicationOptions = {
  imports: [
    PlatformModule
  ],
  providers: [
    { provide: TaskService, useClass: TaskService },
    { provide: UserService, useClass: UserService },
    { provide: MockTokenManager, useClass: MockTokenManager },
    { provide: RefreshTokenService, useClass: RefreshTokenService },
    { provide: CreateTaskOperation, useClass: CreateTaskOperation },
    { provide: BulkCreateTaskOperation, useClass: BulkCreateTaskOperation },
    { provide: GetTaskOperation, useClass: GetTaskOperation },
    { provide: UpdateTaskOperation, useClass: UpdateTaskOperation },
    { provide: RemoveTaskOperation, useClass: RemoveTaskOperation },
    { provide: ListTaskOperation, useClass: ListTaskOperation },
    { provide: PaginatedListTaskOperation, useClass: PaginatedListTaskOperation },
    { provide: PatchTaskOperation, useClass: PatchTaskOperation },
    { provide: BulkRemoveTaskOperation, useClass: BulkRemoveTaskOperation },
    { provide: CustomTaskOperation, useClass: CustomTaskOperation },
    {
      provide: UserProvider,
      useFactory: (userService: UserService) => {
        return new UserProvider<User>(userService);
      },
      deps: [UserService]
    },
    {
      provide: RefreshTokenManager,
      useFactory: (refreshTokenService: RefreshTokenService, tokenManager: MockTokenManager) => {
        return new RefreshTokenManager<RefreshTokenInterface>(refreshTokenService, tokenManager, 100);
      },
      deps: [RefreshTokenService, RefreshTokenService]
    }
  ],
  servers: environmentPlatform.servers,
  logger: environmentPlatform.logger
};