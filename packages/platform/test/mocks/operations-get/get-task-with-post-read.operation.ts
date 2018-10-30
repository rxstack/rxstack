import {ApiOperation, GetOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractGetOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {populateResult} from '../middleware/populate-result';
import {TaskModel} from '../task.model';

@ApiOperation<GetOperationMetadata<TaskModel>>({
  name: 'app_task_get_with_post_read',
  transports: ['HTTP'],
  http_path: '/tasks-with-post-read/:id',
  service: TaskService,
  onPostRead: [
    populateResult({'name': 'modified by post-read'}),
  ]
})
@Injectable()
export class GetTaskWithPostReadOperation extends AbstractGetOperation<TaskModel> { }