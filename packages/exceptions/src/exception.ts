/**
 * Defines base Error class
 */
export class Exception implements Error {
  stack?: string;
  data: any;
  name: string;
  originalError: Error;

  constructor(public message: string) {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Exception);
    }
    this.name = this.constructor.name;
  }
}
