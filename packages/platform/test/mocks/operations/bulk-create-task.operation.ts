import {Operation, ResourceOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {AbstractResourceOperation} from '../../../src/operations/index';
import {ResourceOperationTypesEnum} from '../../../src/enums';

@Operation<ResourceOperationMetadata<TaskModel>>({
  name: 'app_task_bulk_create',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks',
  service: TaskService,
  type: ResourceOperationTypesEnum.BULK_CREATE,
})
@Injectable()
export class BulkCreateTaskOperation extends AbstractResourceOperation<TaskModel> { }