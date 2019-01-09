import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {Operation, ResourceOperationMetadata} from '../../../src/metadata';
import {ResourceOperationTypesEnum} from '../../../src/enums';
import {AbstractResourceOperation} from '../../../src/operations';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.LIST,
  name: 'app_task_list',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks',
  service: TaskService,
})
@Injectable()
export class ListTaskOperation extends AbstractResourceOperation<TaskModel> { }