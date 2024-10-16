import {FilterType, QueryFilterSchema, QueryInterface, SortInterface, TransformCallable} from './interfaces';
import * as _ from 'lodash';

class QueryFilter {
  createQuery(schema: QueryFilterSchema, rawParams: Record<string, any>): QueryInterface {
    const normalizedParams = this.convertToEquality(rawParams);
    const where = this.create(schema, normalizedParams);

    if (schema.allowOrOperator && rawParams['$or']) {
      const orQuery: Record<string, any>[] = [];
      rawParams['$or'].forEach((orParams: Record<string, unknown>) => {
        const orResult = this.create(schema, orParams);
        if (Object.keys(orResult).length > 0) {
          orQuery.push(orResult);
        }
      });
      const orOper = schema.replaceOrOperatorWith ? schema.replaceOrOperatorWith : '$or';
      where[orOper] = orQuery;
    }

    return {
      where: where,
      limit: this.getLimit(rawParams, schema.defaultLimit),
      skip: this.getSkip(rawParams),
      sort: this.getSort(schema, rawParams)
    };
  }

  getLimit(rawParams: Record<string, any>, defaultValue: number): number {
    const limit = parseInt(rawParams['$limit'], 10);
    const lower = !Number.isNaN(limit) && limit > 0 ? limit : defaultValue;
    return Math.min(lower, defaultValue);
  }

  getSkip(rawParams: Record<string, any>): number {
    const skip = rawParams['$skip'];
    if (typeof skip !== 'undefined') {
      const result = Math.abs(parseInt(skip, 10));
      return _.isNaN(result) ? 0 : result;
    }
    return 0;
  }

  getSort(schema: QueryFilterSchema, rawParams: Record<string, any>): SortInterface {
    let sort = rawParams['$sort'];
    const result: any = { };
    if (typeof sort !== 'object') {
      return null;
    }
    sort = _.pick(sort, _.keys(schema.properties));
    _.forEach(sort, (value: any, key: any) => {
      const filterSchema = schema.properties[key];
      if (filterSchema.sort) {
        const parsed = parseInt(value, 10);
        if (parsed === 1 || parsed === -1) {
          const path = filterSchema.property_path || key;
          result[path] = parsed;
        }
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  }

  protected create(schema: QueryFilterSchema, rawParams: Record<string, any>): Record<string, any> {
    const query: any = { };
    const params = _.pick(rawParams, _.keys(schema.properties));
    _.forEach(params, (value: any, key: any) => {
      const filterSchema = schema.properties[key];
      _.keys(value)
        .filter((item: FilterType) => filterSchema.operators.indexOf(item) !== -1)
        .forEach((item: FilterType) => {
          let transformed = value[item];
          if (filterSchema.transformers) {
            transformed = filterSchema.transformers.reduce((value: any, transformer: TransformCallable) => {
              return transformer(value);
            }, transformed);
          }
          const path = filterSchema.property_path || key;
          query[path] = {[this.getOperator(item, filterSchema.replace_operators)]: transformed};
        })
      ;
    });

    return query;
  }

  protected getOperator(filterType: FilterType, operators?: [FilterType, any][]): any {
    let operator: any = filterType;
    if (operators) {
      operators.forEach((op) => {
        if (op[0] === operator) return operator = op[1];
      });
    }
    return operator;
  }

  protected convertToEquality(rawQuery: Record<string, any>): Record<string, any> {
    const normalized: any = { };
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

export const queryFilter = new QueryFilter();
