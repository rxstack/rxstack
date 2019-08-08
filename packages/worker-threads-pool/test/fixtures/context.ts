const asyncHooks = require('async_hooks');

export class Context extends Map {
  get current () {
    const asyncId = asyncHooks.executionAsyncId();
    return this.has(asyncId) ? this.get(asyncId) : null;
  }
  set current (val) {
    const asyncId = asyncHooks.executionAsyncId();
    this.set(asyncId, val);
  }

  extra: any;
}