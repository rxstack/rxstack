import {Operation} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractOperation} from '../../../src/operations/index';
import {Request, Response} from '@rxstack/core';
import {CustomOperationMetadata} from '../custom-operation.metadata';

@Operation<CustomOperationMetadata>({
  name: 'app_task_custom',
  transports: ['SOCKET'],
  template: `
    Hello world
  `
})
@Injectable()
export class CustomTaskOperation extends AbstractOperation {
  metadata: CustomOperationMetadata;

  async execute(request: Request): Promise<Response> {
    return new Response(this.metadata.template);
  }
}