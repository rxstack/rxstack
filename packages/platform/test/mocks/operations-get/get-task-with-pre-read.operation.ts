import {ApiOperation, GetOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractGetOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {setRequestParam} from '../middleware/set-request-param';
import {TaskModel} from '../task.model';

@ApiOperation<GetOperationMetadata<TaskModel>>({
  name: 'app_task_get_with_pre_read',
  transports: ['SOCKET'],
  service: TaskService,
  onPreRead: [
    setRequestParam('pre_read', 'modified'),
  ]
})
@Injectable()
export class GetTaskWithPreReadOperation extends AbstractGetOperation<TaskModel> { }