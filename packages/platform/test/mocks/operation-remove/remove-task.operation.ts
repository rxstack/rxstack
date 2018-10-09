import {ApiOperation, RemoveOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {AbstractRemoveOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';

@ApiOperation<RemoveOperationMetadata<TaskModel>>({
  name: 'app_task_remove',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService
})
@Injectable()
export class RemoveTaskOperation extends AbstractRemoveOperation<TaskModel> { }