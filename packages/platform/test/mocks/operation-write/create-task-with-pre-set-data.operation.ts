import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';
import {setBody} from '../middleware/set-body';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_create_with_pre_set_data',
  transports: ['SOCKET'],
  type: 'POST',
  service: TaskService,
  onPreSetData: [
    setBody({ 'name': 'pre_set_data' })
  ]
})
@Injectable()
export class CreateTaskWithPreSetDataOperation extends AbstractWriteOperation<TaskModel> { }