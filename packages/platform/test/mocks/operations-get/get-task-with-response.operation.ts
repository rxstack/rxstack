import {ApiOperation, GetOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {AbstractGetOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {setResponse} from '../middleware/set-response';

@ApiOperation<GetOperationMetadata<TaskModel>>({
  name: 'app_task_get_with_response',
  transports: ['SOCKET'],
  service: TaskService,
  onPreRead: [
    setResponse('pre_read')
  ],
  onPostRead: [
    setResponse('post_read')
  ]
})
@Injectable()
export class GetTaskWithResponseOperation extends AbstractGetOperation<TaskModel> { }