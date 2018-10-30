import {ApiOperation, ListOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractListOperation} from '../../../src/operations/abstract-list.operation';
import {setResponse} from '../middleware/set-response';
import {TaskModel} from '../task.model';

@ApiOperation<ListOperationMetadata<TaskModel>>({
  name: 'app_task_list_with_response',
  transports: ['SOCKET'],
  service: TaskService,
  onPreCollectionRead: [
    setResponse('pre_read')
  ],
  onQuery: [
    setResponse('query')
  ],
  onPostCollectionRead: [
    setResponse('post_read')
  ]
})
@Injectable()
export class ListTaskOperationWithResponse extends AbstractListOperation<TaskModel> { }