import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';
import {setResponse} from '../middleware/set-response';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_create_with_response',
  transports: ['SOCKET'],
  type: 'POST',
  service: TaskService,
  onPreSetData: [setResponse('pre_set_data')],
  onPostSetData: [
    setResponse('post_set_data')
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