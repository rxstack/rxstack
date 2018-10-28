import {ApiOperation, ListOperationMetadata} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractListOperation} from '../../../src/operations/abstract-list.operation';
import {modifyQuery} from '../middleware/modify-query';
import {populateResult} from '../middleware/populate-result';
import {TaskModel} from '../task.model';

@ApiOperation<ListOperationMetadata<TaskModel>>({
  name: 'app_task_list_with_on_query',
  transports: ['SOCKET'],
  service: TaskService,
  onQuery: [
    modifyQuery({
      'limit': 10,
      'skip': 0,
      'where': {
        'name': 'modified'
      }
    }),
    populateResult([{ 'name': 'modified by on-query' }]),
  ]
})
@Injectable()
export class ListTaskWithOnQueryOperation extends AbstractListOperation<TaskModel> { }