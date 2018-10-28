import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';
import {TaskModel} from '../task.model';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_create',
  transports: ['HTTP', 'SOCKET'],
  http_path: '/tasks/:id',
  type: 'POST',
  service: TaskService
})
@Injectable()
export class CreateTaskOperation extends AbstractWriteOperation<TaskModel> { }