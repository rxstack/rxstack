import {ApiOperation, BulkRemoveOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractBulkRemoveOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {setResponse} from '../middleware/set-response';

@ApiOperation<BulkRemoveOperationMetadata<TaskModel>>({
  name: 'app_task_bulk_remove',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks',
  service: TaskService,
  onPreBulkRemove: [
    setResponse('pre_bulk_update')
  ],
  onPostBulkRemove: [
    setResponse('post_bulk_update')
  ]
})
@Injectable()
export class BulkRemoveTaskOperation extends AbstractBulkRemoveOperation<TaskModel> { }