import {ApiOperation, CreateOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {AbstractCreateOperation} from '../../../src/operations';
import {setResponse} from '../middleware/set-response';

@ApiOperation<CreateOperationMetadata<TaskModel>>({
  name: 'app_task_create',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks',
  service: TaskService,
  onPreCreate: [setResponse('pre_create')],
  onPostCreate: [setResponse('post_create')]
})
@Injectable()
export class CreateTaskOperation extends AbstractCreateOperation<TaskModel> { }