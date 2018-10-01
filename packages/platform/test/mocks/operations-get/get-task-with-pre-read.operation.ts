import {ApiOperation, GetOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {AbstractGetOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {populateResult} from '../middleware/populate-result';

@ApiOperation<GetOperationMetadata<TaskModel>>({
  name: 'app_task_get_with_pre_read',
  transports: ['SOCKET'],
  service: TaskService,
  preRead: [
    populateResult({'name': 'modified by pre-read'}),
  ]
})
@Injectable()
export class GetTaskWithPreReadOperation extends AbstractGetOperation<TaskModel> { }