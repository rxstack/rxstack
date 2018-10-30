import {ApiOperation, RemoveOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractRemoveOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {ApiOperationEvent} from '../../../src/events';
import {TaskModel} from '../task.model';

@ApiOperation<RemoveOperationMetadata<TaskModel>>({
  name: 'app_task_remove_with_post_remove',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService,
  onPostRemove: [
    async (event: ApiOperationEvent): Promise<void> => {
      event.statusCode = 200;
      event.setData({
        success: true
      });
    }
  ]
})
@Injectable()
export class RemoveTaskWithPostRemoveOperation extends AbstractRemoveOperation<TaskModel> { }