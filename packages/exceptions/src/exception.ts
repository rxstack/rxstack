/**
 * Defines base Error class
 */
export class Exception implements Error {
  stack?: string;
  data: any;
  name: string;

  constructor(public message: string) {
    Error.captureStackTrace(this);
    this.name = this.constructor.name;
  }
}