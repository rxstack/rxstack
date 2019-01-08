import {Operation, ResourceOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {AbstractResourceOperation} from '../../../src/operations';
import {ResourceOperationTypesEnum} from '../../../src/enums';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.BULK_REMOVE,
  name: 'app_task_bulk_remove',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks',
  service: TaskService
})
@Injectable()
export class BulkRemoveTaskOperation extends AbstractResourceOperation<TaskModel> { }