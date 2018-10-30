import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';
import {TaskModel} from '../task.model';
import {ApiOperationEvent} from '../../../src/events';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_patch',
  transports: ['SOCKET'],
  type: 'PATCH',
  service: TaskService,
  onPostWrite: [
    async (event: ApiOperationEvent): Promise<void> => {
      event.statusCode = 200;
    }
  ]
})
@Injectable()
export class PatchTaskOperation extends AbstractWriteOperation<TaskModel> { }