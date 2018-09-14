import {GenericBag} from './generic-bag';
import {File} from './file';

export class FileBag extends GenericBag<File> {
  fromObject(data?: Object): this {
    for (let key in data) {
      this.set(key, new File(data[key]));
    }
    return this;
  }
}