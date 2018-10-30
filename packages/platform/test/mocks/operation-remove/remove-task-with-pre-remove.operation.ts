import {ApiOperation, RemoveOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractRemoveOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {ApiOperationEvent} from '../../../src/events';
import {ForbiddenException} from '@rxstack/exceptions';
import {TaskModel} from '../task.model';

@ApiOperation<RemoveOperationMetadata<TaskModel>>({
  name: 'app_task_remove_with_pre_remove',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  service: TaskService,
  onPreRemove: [
    async (event: ApiOperationEvent): Promise<void> => {
      throw new ForbiddenException();
    }
  ]
})
@Injectable()
export class RemoveTaskWithPreRemoveOperation extends AbstractRemoveOperation<TaskModel> { }