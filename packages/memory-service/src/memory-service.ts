import {ResourceInterface, ServiceInterface, Constructable} from '@rxstack/platform';
import {QueryInterface} from '@rxstack/query-filter';
import {Injectable} from 'injection-js';
import {MatcherInterface, SorterInterface} from './interfaces';
import {NonUniqueResultException, MissingIdentifierException} from '@rxstack/platform';
import * as _ from 'lodash';
import {DataContainer} from './data-container';

const uuid = require('uuid/v4');

@Injectable()
export class MemoryService<T extends ResourceInterface> implements ServiceInterface<T> {

  constructor(protected dataContainer: DataContainer<T>,
              protected type: Constructable<T>,
              protected name: string,
              protected matcher: MatcherInterface,
              protected sorter: SorterInterface) { }

  async createNew(data?: any): Promise<T> {
    const obj = new this.type();
    obj.id = uuid();
    return obj;
  }

  async save(resource: T): Promise<T> {
    if (!resource.id) {
      throw new MissingIdentifierException();
    }
    this.getCollection().set(resource.id, resource);
    return resource;
  }

  async remove(resource: T): Promise<void> {
    if (!resource.id) {
      throw new MissingIdentifierException();
    }
    this.getCollection().delete(resource.id);
  }

  async count(criteria?: Object): Promise<number> {
    return Array.from(this.getCollection().values())
      .filter(this.matcher.match(criteria)).length;
  }

  async find(id: any): Promise<T> {
    return this.getCollection().get(id);
  }

  async findOne(criteria: Object): Promise<T> {
    const result = Array.from(this.getCollection().values())
      .filter(this.matcher.match(criteria));
    if (result.length > 1) {
      throw new NonUniqueResultException(criteria);
    }
    return _.first(result);
  }

  async findMany(query?: QueryInterface): Promise<T[]> {
    query = Object.assign({}, query);
    return Array.from(this.getCollection().values())
      .filter(this.matcher.match(query.where))
      .sort(this.sorter.sort(query.sort))
      .slice(query.skip)
      .slice(0, query.limit)
    ;
  }

  protected getCollection(): Map<string, T> {
    return this.dataContainer.getCollection(this.name);
  }
}