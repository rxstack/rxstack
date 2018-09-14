import {NamedServiceInterface} from '../src/named-service.interface';

export class MockService implements NamedServiceInterface {
  getName(): string {
    return 'mock-service';
  }
}