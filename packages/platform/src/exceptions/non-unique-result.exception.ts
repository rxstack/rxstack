import {Exception} from '@rxstack/exceptions';

export class NonUniqueResultException extends Exception {
  constructor(criteria: Object) {
    super(`Non unique result with the given criteria: ${JSON.stringify(criteria)}`);
  }
}