import 'reflect-metadata';
import {MODULE_KEY , ModuleMetadata, } from './interfaces';
import * as _ from 'lodash';

const normalize = function (options?: ModuleMetadata): ModuleMetadata {
  let defaultOptions: ModuleMetadata = { providers: [] };
  if (options) {
    return _.merge(defaultOptions, options);
  }
  return defaultOptions;
};

export function Module(options?: ModuleMetadata): ClassDecorator {
  return function (target: Function): void {
    Reflect.defineMetadata(MODULE_KEY, normalize(options), target);
  };
}
