import {ApiOperation, ListOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractListOperation} from '../../../src/operations/abstract-list.operation';
import {taskQuerySchema} from '../query-schemas/task.query-schema';
import {TaskModel} from '../task.model';

@ApiOperation<ListOperationMetadata<TaskModel>>({
  name: 'app_task_list_with_query',
  transports: ['SOCKET'],
  service: TaskService,
  paginated: false,
  queryFilterSchema: taskQuerySchema
})
@Injectable()
export class ListTaskWithQueryOperation extends AbstractListOperation<TaskModel> { }