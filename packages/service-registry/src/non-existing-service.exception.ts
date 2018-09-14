import {Exception} from '@rxstack/exceptions';

export class NonExistingServiceException extends Exception {
  constructor(name: string) {
    super(`Service with name "${name}" does not exist.`);
  }
}