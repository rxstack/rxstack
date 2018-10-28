import {ServiceInterface} from '@rxstack/platform';
import {QueryInterface, SortInterface} from '@rxstack/query-filter';
import {Injectable, Injector} from 'injection-js';
import {MATCHER_TOKEN, MatcherInterface, MemoryServiceOptions, SORTER_TOKEN, SorterInterface} from './interfaces';
import * as _ from 'lodash';
import {DataContainer} from './data-container';
import {BadRequestException} from '@rxstack/exceptions';
import {InjectorAwareInterface} from '@rxstack/core';

const uuid = require('uuid/v4');

@Injectable()
export class MemoryService<T> implements ServiceInterface<T>, InjectorAwareInterface {

  protected injector: Injector;

  constructor(public options: MemoryServiceOptions) { }

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  async create(data: Object): Promise<T> {
    const id = data[this.options.idField] || uuid();
    this.assertObject(id, true);
    const obj = _.extend({}, data, { [this.options.idField]: id }) as T;
    this.getCollection().set(id, obj);
    return obj;
  }

  async replace(id: any, data: Object): Promise<T> {
    this.assertObject(id, false);
    const replacedObj = _.extend({}, data, { [this.options.idField]: id }) as T;
    this.getCollection().set(id, replacedObj);
    return replacedObj;
  }

  async patch(id: any, data: Object): Promise<T> {
    this.assertObject(id, false);
    const patchedObj = _.extend(this.getCollection().get(id), _.omit(data, this.options.idField)) as T;
    this.getCollection().set(id, patchedObj);
    return patchedObj;
  }

  async remove(id: any): Promise<void> {
    this.assertObject(id, false);
    this.getCollection().delete(id);
  }

  async count(criteria?: Object): Promise<number> {
    return Array.from(this.getCollection().values())
      .filter(this.getMather().match(criteria)).length;
  }

  async findOneById(id: any): Promise<T> {
    return this.getCollection().get(id);
  }

  async findOne(criteria: Object, sort?: SortInterface): Promise<T> {
    const result = Array.from(this.getCollection().values())
      .filter(this.getMather().match(criteria))
      .sort(this.getSorter().sort(sort))
    ;
    return _.first(result);
  }

  async findMany(query?: QueryInterface): Promise<T[]> {
    query = Object.assign({}, query);
    return Array.from(this.getCollection().values())
      .filter(this.getMather().match(query.where))
      .sort(this.getSorter().sort(query.sort))
      .slice(query.skip)
      .slice(0, query.limit)
    ;
  }

  protected getCollection(): Map<string, T> {
    return this.injector.get(DataContainer).getCollection<T>(this.options.collectionName);
  }

  protected getMather(): MatcherInterface {
    return this.injector.get(MATCHER_TOKEN);
  }

  protected getSorter(): SorterInterface {
    return this.injector.get(SORTER_TOKEN);
  }

  private assertObject(id: any, ifExists: boolean): void {
    let message: string;
    if (ifExists && this.getCollection().has(id)) {
      message = `Record with ${id} already exists.`;
    } else if (!ifExists && !this.getCollection().has(id)) {
      message = `Record with ${id} does not exist.`;
    }
    if (message) {
      throw new BadRequestException(message);
    }
  }
}