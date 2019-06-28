import * as _ from 'lodash';
import {
  sampleQueryFilterSchema,
  sampleQueryFilterSchemaWithCustomOperator,
  sampleQueryFilterSchemaWithOrDisabled, sampleQueryFilterSchemaWithOrReplaced
} from './query-filter-schemas';
import {queryFilter} from '../src/query-filter';
const chai = require('chai');
const expect = chai.expect;

describe('QueryFilter', () => {
  it('should build query result with empty params', () => {
    let params = {};
    let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
    expect(_.isEqual(result.where, {})).to.be.equal(true);
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(sampleQueryFilterSchema.defaultLimit);
    expect(result.sort).to.be.equal(null);
  });

  describe('Limit', () => {
    it('should build limit', () => {
      let params = {'$limit': 5};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.limit).to.be.equal(5);
    });

    it('should build limit with invalid param', () => {
      let params = {'$limit': 'invalid'};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.limit).to.be.equal(sampleQueryFilterSchema.defaultLimit);
    });
  });

  describe('Skip', () => {
    it('should build skip', () => {
      let params = {'$skip': 2};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.skip).to.be.equal(2);
    });

    it('should build skip with invalid param', () => {
      let params = {'$skip': 'invalid'};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.skip).to.be.equal(0);
    });
  });

  describe('Sort', () => {
    it('should build sort', () => {
      let params = {'$sort': {'query_name': 1}};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(_.isEqual(result.sort, {'db_name': 1})).to.be.equal(true);
    });

    it('should skip sort if operator is invalid', () => {
      let params = {'$sort': {'query_name': 'invalid'}};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });

    it('should skip sort with invalid signature', () => {
      let params = {'$sort': 'invalid'};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });

    it('should skip sort if param is not in the schema', () => {
      let params = {'$sort': {'unknown': 1}};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });

    it('should skip sort if sort is not enabled', () => {
      let params = {'$sort': {'not_used': 1}};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });
  });

  describe('Query', () => {
    ['$lt', '$lte', '$gt', '$gte', '$ne', '$eq'].forEach((op: string) => {
      it(`should build ${op} operator`, () => {
        let params = {'query_name': {[op]: 'any'}};
        let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
        const expected = {'db_name': {[op]: 'any'}};
        expect(_.isEqual(result.where, expected)).to.be.equal(true);
      });

      it(`should exclude ${op} operator`, () => {
        let params = {'not_used': {[op]: 'any'}};
        let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
        const expected = {};
        expect(_.isEqual(result.where, expected)).to.be.equal(true);
      });
    });

    it(`should build $or operator`, () => {
      let params = {'query_name': {'$eq': 'any'}, '$or': [{'id': {'$eq': 12}}, {'id': {'$lt': 24}}]};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      const expected = {'db_name': {'$eq': 'any'}, '$or': [{'id': {'$eq': 12}}, {'id': {'$lt': 24}}]};
      expect(_.isEqual(result.where, expected)).to.be.equal(true);
    });

    it(`should not build $or operator`, () => {
      let params = {'query_name': {'$eq': 'any'}, '$or': [{'id': {'$eq': 12}}, {'id': {'$lt': 24}}]};
      let result = queryFilter.createQuery(sampleQueryFilterSchemaWithOrDisabled, params);
      const expected = {'db_name': {'$eq': 'any'}};
      expect(_.isEqual(result.where, expected)).to.be.equal(true);
    });

    it(`should replace $or operator`, () => {
      let params = {'query_name': {'$eq': 'any'}, '$or': [{'query_name': {'$eq': 12}}, {'query_name': {'$lt': 24}}]};
      let result = queryFilter.createQuery(sampleQueryFilterSchemaWithOrReplaced, params);
      const s = Object.getOwnPropertySymbols(result.where).shift().toString();
      expect(s === 'Symbol(or)').to.be.equal(true);
    });

    it(`should build $in operator with transformer`, () => {
      let params = {'query_arr': {'$in': 'test1,test2'}};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      const expected = {'query_arr': {'$in': ['test1', 'test2']}};
      expect(_.isEqual(result.where, expected)).to.be.equal(true);
    });

    it(`should replace operators with custom ones`, () => {
      let params = {'query_name': {'$eq': 'test1'}};
      let result = queryFilter.createQuery(sampleQueryFilterSchemaWithCustomOperator, params);
      const expected = {'query_name': {'$custom1': 'test1'}};
      expect(_.isEqual(result.where, expected)).to.be.equal(true);
    });

    it(`should filter and sort without property path`, () => {
      let params = {'param_without_property_path': {'$eq': 'test1'}, '$sort': {'param_without_property_path': 1}};
      let result = queryFilter.createQuery(sampleQueryFilterSchema, params);
      const expected = {'param_without_property_path': {'$eq': 'test1'}};
      expect(_.isEqual(result.where, expected)).to.be.equal(true);
      expect(_.isEqual(result.sort, {'param_without_property_path': 1})).to.be.equal(true);
    });

  });
});