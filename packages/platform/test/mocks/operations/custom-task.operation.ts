import {Operation} from '../../../src/metadata/index';
import {Injectable} from 'injection-js';
import {AbstractOperation} from '../../../src/operations/index';
import {CustomOperationMetadata} from '../custom-operation.metadata';
import {OperationEvent} from '../../../src/events';

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

  protected async doExecute(event: OperationEvent): Promise<void> {
    event.setData(this.metadata.template);
  }
}