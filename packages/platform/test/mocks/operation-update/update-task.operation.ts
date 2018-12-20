import {ApiOperation} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {AbstractUpdateOperation} from '../../../src/operations';
import {setResponse} from '../middleware/set-response';
import {UpdateOperationMetadata} from '../../../src/metadata/update-operation.metadata';

@ApiOperation<UpdateOperationMetadata<TaskModel>>({
  name: 'app_task_update',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService,
  onPreRead: [setResponse('pre_read')],
  onPreUpdate: [setResponse('pre_update')],
  onPostUpdate: [setResponse('post_update')]
})
@Injectable()
export class UpdateTaskOperation extends AbstractUpdateOperation<TaskModel> { }