import {ApiOperation, GetOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {AbstractGetOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';

@ApiOperation<GetOperationMetadata<TaskModel>>({
  name: 'app_task_get',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService
})
@Injectable()
export class GetTaskOperation extends AbstractGetOperation<TaskModel> { }