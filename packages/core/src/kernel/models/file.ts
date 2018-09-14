export class File {
  name: string;
  size: number;
  type: string;
  path: string;
  hash?: string;

  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}