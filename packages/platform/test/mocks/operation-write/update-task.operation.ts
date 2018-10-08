import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_update',
  transports: ['SOCKET'],
  type: 'PUT',
  service: TaskService
})
@Injectable()
export class UpdateTaskOperation extends AbstractWriteOperation<TaskModel> { }