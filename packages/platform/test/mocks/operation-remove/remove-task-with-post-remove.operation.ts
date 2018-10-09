import {ApiOperation, RemoveOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {AbstractRemoveOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {ApiOperationEvent} from '../../../src/events';

@ApiOperation<RemoveOperationMetadata<TaskModel>>({
  name: 'app_task_remove_with_post_remove',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService,
  onPostRemove: [
    async (event: ApiOperationEvent): Promise<void> => {
      event.statusCode = 200;
      event.data = {
        success: true
      };
    }
  ]
})
@Injectable()
export class RemoveTaskWithPostRemoveOperation extends AbstractRemoveOperation<TaskModel> { }