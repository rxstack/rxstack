import {ApiOperation, WriteOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractWriteOperation} from '../../../src/operations/abstract-write.operation';
import {ApiOperationEvent} from '../../../src/events';

@ApiOperation<WriteOperationMetadata<TaskModel>>({
  name: 'app_task_create_with_post_set_data',
  transports: ['SOCKET'],
  type: 'POST',
  service: TaskService,
  onPostSetData: [
    async (event: ApiOperationEvent) => {
      const metadata = event.metadata as WriteOperationMetadata<TaskModel>;
      metadata.validatorOptions.groups = ['post_set_data'];
    }
  ]
})
@Injectable()
export class CreateTaskWithPostSetDataOperation extends AbstractWriteOperation<TaskModel> { }