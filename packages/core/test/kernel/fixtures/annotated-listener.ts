import {RequestEvent} from '../../../src/kernel/events/request-event';
import {Response} from '../../../src/kernel/models/response';
import {Observe} from '@rxstack/async-event-dispatcher';
import {KernelEvents} from '../../../src/kernel/kernel-events';
import {ResponseEvent} from '../../../src/kernel/events/response-event';
import {ExceptionEvent} from '../../../src/kernel/events/exception-event';
import {InternalServerErrorException} from '@rxstack/exceptions';
import {Injectable} from 'injection-js';

@Injectable()
export class AnnotatedListener {
  @Observe(KernelEvents.KERNEL_REQUEST)
  async onRequest(event: RequestEvent): Promise<void> {
    if (event.getRequest().params.get('type') !== 'test_request_event') {
      return;
    }

    const response = new Response('modified_by_request_event');
    event.setResponse(response);
  }

  @Observe(KernelEvents.KERNEL_RESPONSE)
  async onResponse(event: ResponseEvent): Promise<void> {
    if (event.getRequest().params.get('type') !== 'test_response_event') {
      return;
    }

    const response = new Response('modified_by_response_event');
    event.setResponse(response);
  }

  @Observe(KernelEvents.KERNEL_EXCEPTION)
  async onException(event: ExceptionEvent): Promise<void> {
    if (event.getRequest().params.get('type') !== 'test_exception_event') {
      return;
    }

    const response = new Response('modified_by_exception_event');
    event.setResponse(response);
  }

  @Observe(KernelEvents.KERNEL_EXCEPTION, -10)
  async onExceptionWithChangedException(event: ExceptionEvent): Promise<void> {
    if (event.getRequest().params.get('type') !== 'test_exception_event_with_changed_exception') {
      return;
    }
    event.setException(new InternalServerErrorException());
  }

  @Observe(KernelEvents.KERNEL_RESPONSE, 10)
  async onResponseWithException(event: ResponseEvent): Promise<void> {
    if (event.getRequest().params.get('type') !== 'test_response_event_with_exception') {
      return;
    }

    throw new Error('ExceptionInResponseEvent');
  }
}