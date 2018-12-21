import {ApiOperation, PatchOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractPatchOperation} from '../../../src/operations/index';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {ApiOperationEvent} from '../../../src/events/index';
import {setResponse} from '../middleware/set-response';

@ApiOperation<PatchOperationMetadata<TaskModel>>({
  name: 'app_task_patch',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks',
  service: TaskService,
  onPrePatch: [setResponse('pre_patch')],
  onPostPatch: [
    async (event: ApiOperationEvent): Promise<void> => {
      if (event.request.params.get('status_code')) {
        event.statusCode = event.request.params.get('status_code');
      }
    },
    setResponse('post_patch')
  ],
})
@Injectable()
export class PatchTaskOperation extends AbstractPatchOperation<TaskModel> { }