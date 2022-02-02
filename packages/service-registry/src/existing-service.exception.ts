import {Exception} from '@rxstack/exceptions';

export class ExistingServiceException extends Exception {
  constructor(name: string) {
    super(`Service with name "${name}" already exists.`);
  }
}
