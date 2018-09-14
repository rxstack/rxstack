import {FilterType, QueryFilterResult, QueryFilterSchema, Sort, TransformFunc} from './interfaces';
import * as _ from 'lodash';

/**
 * QueryFilter builds a query from raw parameters applying a pre-defined schema.
 */
export class QueryFilter {
  /**
   * Creates query from raw params
   *
   * @param {QueryFilterSchema} schema
   * @param {Object} rawParams
   * @returns {QueryFilterResult}
   */
  static createQuery(schema: QueryFilterSchema, rawParams: Object): QueryFilterResult {
    const normalizedParams = QueryFilter.normalize(rawParams);
    let where = QueryFilter.create(schema, normalizedParams);

    if (schema.allowOrOperator && rawParams['$or']) {
      const orQuery: Object[] = [];
      rawParams['$or'].forEach((orParams: Object) => {
        orQuery.push(QueryFilter.create(schema, orParams));
      });
      where['$or'] = orQuery;
    }

    return {
      where: where,
      limit: QueryFilter.getLimit(rawParams, schema.defaultLimit),
      skip: QueryFilter.getSkip(rawParams),
      sort: QueryFilter.getSort(schema, rawParams)
    };
  }

  /**
   * Extract limit value or use the default one
   *
   * @param {Object} rawParams
   * @param {number} defaultValue
   * @returns {number}
   */
  static getLimit(rawParams: Object, defaultValue: number): number {
    const limit = parseInt(rawParams['$limit'], 10);
    const lower = !Number.isNaN(limit) && limit > 0 ? limit : defaultValue;
    return Math.min(lower, defaultValue);
  }

  /**
   * Extracts $skip
   *
   * @param {Object} rawParams
   * @returns {number}
   */
  static getSkip(rawParams: Object): number {
    const skip = rawParams['$skip'];
    if (typeof skip !== 'undefined') {
      const result = Math.abs(parseInt(skip, 10));
      return _.isNaN(result) ? 0 : result;
    }
    return 0;
  }

  /**
   * Extract $sort
   *
   * @param {QueryFilterSchema} schema
   * @param {Object} rawParams
   * @returns {Sort}
   */
  static getSort(schema: QueryFilterSchema, rawParams: Object): Sort {
    let sort = rawParams['$sort'];
    const result = {};
    if (typeof sort !== 'object') {
      return null;
    }
    sort = _.pick(sort, _.keys(schema.properties));
    _.forEach(sort, (value, key) => {
      let filterSchema = schema.properties[key];
      if (filterSchema.sort) {
        const parsed = parseInt(value, 10);
        if (parsed === 1 || parsed === -1) {
          result[filterSchema.property_path] = parsed;
        }
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Internal create method
   *
   * @param {QueryFilterSchema} schema
   * @param {Object} rawParams
   * @returns {Object}
   */
  static create(schema: QueryFilterSchema, rawParams: Object): Object {
    const query = {};
    const params = _.pick(rawParams, _.keys(schema.properties));
    _.forEach(params, (value, key) => {
      const filterSchema = schema.properties[key];
      _.keys(value)
        .filter((item: FilterType) => filterSchema.operators.indexOf(item) !== -1)
        .forEach((item: FilterType) => {
          let transformed = value[item];
          if (filterSchema.transformers) {
            transformed = filterSchema.transformers.reduce((value: any, transformer: TransformFunc) => {
              return transformer(value);
            }, transformed);
          }
          query[filterSchema.property_path] = {[item]: transformed};
        })
      ;
    });

    return query;
  }

  /**
   * Creates $eq operator when provided like that: ?id=12
   *
   * @param {Object} rawQuery
   * @returns {Object}
   */
  static normalize(rawQuery: Object): Object {
    const normalized = {};
    _.forEach(rawQuery, (value: any, key: any): void => {
      if (typeof value !== 'object') {
        normalized[key] = {'$eq': value};
      }  else {
        normalized[key] = value;
      }
    });

    return normalized;
  }
}