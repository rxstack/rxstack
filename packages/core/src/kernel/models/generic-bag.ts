/**
 * Generic container
 */
export class GenericBag<T> extends Map<string, T> {
  /**
   * Constructor
   *
   * @param {Object} data
   */
  constructor(data?: Object) {
    super();
    if (data) {
      this.fromObject(data);
    }
  }

  /**
   * Exports Map to plain object
   *
   * @returns {Object}
   */
  toObject(): Object {
    const data: Object = {};
    this.forEach((value: T, key: string) => data[key] = value);
    return data;
  }

  /**
   * Sets Map from plain object
   *
   * @param {Object} data
   * @returns {this}
   */
  fromObject(data?: Object): this {
    for (let key in data) {
      this.set(key, data[key]);
    }
    return this;
  }
}