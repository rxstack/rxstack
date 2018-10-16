import * as _ from 'lodash';
import {FilterCallback, MatcherInterface} from './interfaces';
import {FilterType} from '@rxstack/query-filter';
import {Injectable} from 'injection-js';

@Injectable()
export class Matcher implements MatcherInterface {

  protected _filters: Map<FilterType, { (key: string, value: any): FilterCallback }> = new Map();

  constructor() {
    this._filters.set('$in', (key: string, value: any) => (current: any) => _.includes(current[key], value));
    this._filters.set('$nin', (key: string, value: any) => (current) => !_.includes(current[key], value));
    this._filters.set('$lt', (key: string, value: any) => (current) => _.lt(value, current[key]));
    this._filters.set('$lte', (key: string, value: any) => (current) => _.lte(value, current[key]));
    this._filters.set('$gt', (key: string, value: any) => (current) => _.gt(value, current[key]));
    this._filters.set('$gte', (key: string, value: any) => (current) => _.gte(value, current[key]));
    this._filters.set('$ne', (key: string, value: any) => (current) => !_.isEqual(value, current[key]));
    this._filters.set('$eq', (key: string, value: any) => (current) => _.isEqual(value, current[key]));
  }

  match(query: {[key: string]: any}): FilterCallback {
    return (item: any): boolean => {
      return query && _.isObject(query['$or']) ?
        _.isObject(query['$or']) && _.some(query['$or'], or => this.match(or)(item)) :
        this.resolveQuery(query, item);
    };
  }

  private resolveQuery(query: {[key: string]: any}, item: any): boolean {
    return _.every<{[key: string]: any}>(query, (value: any, key: string) => {
      return _.isObject(value) && _.every(value, (target: any, filterType: FilterType) => {
        return this._filters.has(filterType) && this._filters.get(filterType)(key, target)(item);
      });
    });
  }
}