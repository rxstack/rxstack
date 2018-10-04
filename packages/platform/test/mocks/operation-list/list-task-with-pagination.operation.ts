import {ApiOperation, ListOperationMetadata} from '../../../src/metadata/index';
import {TaskModel} from '../task.model';
import {Injectable} from 'injection-js';
import {TaskService} from '../task.service';
import {AbstractListOperation} from '../../../src/operations/abstract-list.operation';

@ApiOperation<ListOperationMetadata<TaskModel>>({
  name: 'app_task_list_paginated',
  transports: ['SOCKET'],
  service: TaskService,
  paginated: true
})
@Injectable()
export class ListTaskWithPaginationOperation extends AbstractListOperation<TaskModel> { }