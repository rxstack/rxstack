import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';
import {ApiOperationEvent} from '../../../src/events';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_create_with_pre_write',
  transports: ['SOCKET'],
  type: 'POST',
  service: TaskService,
  onPreWrite: [
    async (event: ApiOperationEvent): Promise<void> => {
      const data = event.data as TaskModel;
      data.name = 'pre_write';
    }
  ]
})
@Injectable()
export class CreateTaskWithPreWriteOperation extends AbstractWriteOperation<TaskModel> { }