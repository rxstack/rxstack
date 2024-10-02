const path = require('path');
import * as _ from 'lodash';

class Configuration {

  initialize(dir: string, filename = 'environment'): void {
    const baseFile: Record<string, unknown> = require(dir + path.sep + filename);
    try {
      const envFile: Record<string, unknown> = require(dir + path.sep + filename + '.' + this.getEnvironment());
      _.mergeWith(baseFile, envFile, (a: unknown, b: unknown) =>  {
        if (_.isArray(a) && _.isArray(b) && b.length === 0) return b;
      });
    } catch (e) {
      // do nothing
    }

    this.normalize(baseFile);
  }

  getRootPath(): string {
    return require('app-root-path').path;
  }

  getEnvironment(): string {
    const env: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
    return env.toLowerCase();
  }

  private normalize(data: any): any {
    Object.keys(data).forEach(name => {
      let value = data[name];

      if (Array.isArray(value)) {
        this.normalize(value);
      }

      if (typeof value === 'object') {
        data[name] = this.normalize(value);
      }

      if (typeof value === 'string') {
        if (process.env[value]) {
          value = process.env[value];
        } else if (value.indexOf('.') === 0 || value.indexOf('..') === 0) {
          value = path.resolve(
            path.join(this.getRootPath()),
            value.replace(/\//g, path.sep)
          );
        }
        data[name] = value;
      }
    });
    return data;
  }
}

export const configuration = new Configuration();
