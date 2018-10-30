import {ApiOperation, ListOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractListOperation} from '../../../src/operations/abstract-list.operation';
import {setRequestParam} from '../middleware/set-request-param';
import {TaskModel} from '../task.model';

@ApiOperation<ListOperationMetadata<TaskModel>>({
  name: 'app_task_list_with_pre_read',
  transports: ['SOCKET'],
  service: TaskService,
  onPreCollectionRead: [
    setRequestParam('app_task_list_with_pre_read', 'modified')
  ]
})
@Injectable()
export class ListTaskOperationWithPreRead extends AbstractListOperation<TaskModel> { }