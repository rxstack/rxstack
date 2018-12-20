import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';
import {setResponse} from '../middleware/set-response';
import {TaskModel} from '../task.model';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_create_with_response',
  transports: ['SOCKET'],
  type: 'POST',
  service: TaskService,
  onPreRead: [
    setResponse('pre_read')
  ],
  onPreWrite: [
    setResponse('pre_write')
  ],
  onPostWrite: [
    setResponse('post_write')
  ]
})
@Injectable()
export class CreateTaskWithResponseOperation extends AbstractWriteOperation<TaskModel> { }