import {Operation, ResourceOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {TaskModel} from '../task.model';
import {AbstractResourceOperation} from '../../../src/operations/index';
import {ResourceOperationTypesEnum} from '../../../src/enums';
import {setResponse} from '../middleware/set-response';

@Operation<ResourceOperationMetadata<TaskModel>>({
  name: 'app_task_create',
  transports: ['HTTP', 'SOCKET'],
  httpPath: '/tasks',
  service: TaskService,
  type: ResourceOperationTypesEnum.CREATE,
  onPreExecute: [
    setResponse('pre_execute')
  ],
  onPostExecute: [
    setResponse('post_execute')
  ]
})
@Injectable()
export class CreateTaskOperation extends AbstractResourceOperation<TaskModel> { }