import {Operation, ResourceOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {AbstractResourceOperation} from '../../../src/operations/index';
import {ResourceOperationTypesEnum} from '../../../src/enums';

@Operation<ResourceOperationMetadata<TaskModel>>({
  name: 'app_task_update',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService,
  type: ResourceOperationTypesEnum.UPDATE
})
@Injectable()
export class UpdateTaskOperation extends AbstractResourceOperation<TaskModel> { }