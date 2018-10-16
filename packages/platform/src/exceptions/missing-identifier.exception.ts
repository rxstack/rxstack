import {Exception} from '@rxstack/exceptions';

export class MissingIdentifierException extends Exception {
  constructor(message = 'Identifier is missing.') {
    super(message);
  }
}