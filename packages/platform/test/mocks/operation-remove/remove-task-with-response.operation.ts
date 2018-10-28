import {ApiOperation, RemoveOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractRemoveOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {setResponse} from '../middleware/set-response';
import {TaskModel} from '../task.model';

@ApiOperation<RemoveOperationMetadata<TaskModel>>({
  name: 'app_task_remove_with_response',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService,
  onPreRemove: [
    setResponse('pre_remove')
  ],
  onPostRemove: [
    setResponse('post_remove')
  ]
})
@Injectable()
export class RemoveTaskWithResponseOperation extends AbstractRemoveOperation<TaskModel> { }