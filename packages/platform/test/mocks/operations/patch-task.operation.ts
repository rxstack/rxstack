import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {Operation, ResourceOperationMetadata} from '../../../src/metadata';
import {ResourceOperationTypesEnum} from '../../../src/enums';
import {AbstractResourceOperation} from '../../../src/operations';

@Operation<ResourceOperationMetadata<TaskModel>>({
  type: ResourceOperationTypesEnum.PATCH,
  name: 'app_task_patch',
  transports: ['SOCKET'],
  service: TaskService,
})
@Injectable()
export class PatchTaskOperation extends AbstractResourceOperation<TaskModel> { }