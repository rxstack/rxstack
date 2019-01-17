import {Operation, ResourceOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {AbstractResourceOperation} from '../../../src/operations/index';
import {ResourceOperationTypesEnum} from '../../../src/enums';

@Operation<ResourceOperationMetadata<TaskModel>>({
  name: 'app_task_remove',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks/:id',
  service: TaskService,
  type: ResourceOperationTypesEnum.REMOVE
})
@Injectable()
export class RemoveTaskOperation extends AbstractResourceOperation<TaskModel> { }