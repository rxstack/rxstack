import {sampleQueryFilterSchema, sampleQueryFilterSchemaWithOrDisabled} from './query-filter-schemas';
import {QueryFilter} from '../src/query-filter';
const chai = require('chai');
const expect = chai.expect;

describe('QueryFilter', () => {
  it('should build query result with empty params', () => {
    let params = {};
    let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
    expect(JSON.stringify(result.where)).to.be.equal(JSON.stringify({}));
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(sampleQueryFilterSchema.defaultLimit);
    expect(result.sort).to.be.equal(null);
  });

  describe('Limit', () => {
    it('should build limit', () => {
      let params = {'$limit': 5};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.limit).to.be.equal(5);
    });

    it('should build limit with invalid param', () => {
      let params = {'$limit': 'invalid'};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.limit).to.be.equal(sampleQueryFilterSchema.defaultLimit);
    });
  });

  describe('Skip', () => {
    it('should build skip', () => {
      let params = {'$skip': 2};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.skip).to.be.equal(2);
    });

    it('should build skip with invalid param', () => {
      let params = {'$skip': 'invalid'};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.skip).to.be.equal(0);
    });
  });

  describe('Sort', () => {
    it('should build sort', () => {
      let params = {'$sort': {'query_name': 1}};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(JSON.stringify(result.sort)).to.be.equal(JSON.stringify({'db_name': 1}));
    });

    it('should skip sort if operator is invalid', () => {
      let params = {'$sort': {'query_name': 'invalid'}};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });

    it('should skip sort with invalid signature', () => {
      let params = {'$sort': 'invalid'};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });

    it('should skip sort if param is not in the schema', () => {
      let params = {'$sort': {'unknown': 1}};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });

    it('should skip sort if sort is not enabled', () => {
      let params = {'$sort': {'not_used': 1}};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(result.sort).to.be.equal(null);
    });
  });

  describe('Query', () => {
    ['$lt', '$lte', '$gt', '$gte', '$ne', '$eq'].forEach((op: string) => {
      it(`should build ${op} operator`, () => {
        let params = {'query_name': {[op]: 'any'}};
        let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
        expect(JSON.stringify(result.where)).to.be.equal(JSON.stringify({'db_name': {[op]: 'any'}}));
      });

      it(`should exclude ${op} operator`, () => {
        let params = {'not_used': {[op]: 'any'}};
        let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
        expect(JSON.stringify(result.where)).to.be.equal(JSON.stringify({}));
      });
    });

    it(`should build $or operator`, () => {
      let params = {'query_name': {'$eq': 'any'}, '$or': [{'id': {'$eq': 12}}, {'id': {'$lt': 24}}]};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(JSON.stringify(result.where)).to.be.equal(
        JSON.stringify({'db_name': {'$eq': 'any'}, '$or': [{'id': {'$eq': 12}}, {'id': {'$lt': 24}}]})
      );
    });

    it(`should not build $or operator`, () => {
      let params = {'query_name': {'$eq': 'any'}, '$or': [{'id': {'$eq': 12}}, {'id': {'$lt': 24}}]};
      let result = QueryFilter.createQuery(sampleQueryFilterSchemaWithOrDisabled, params);
      expect(JSON.stringify(result.where)).to.be.equal(
        JSON.stringify({'db_name': {'$eq': 'any'}})
      );
    });

    it(`should build $in operator with transformer`, () => {
      let params = {'query_arr': {'$in': 'test1,test2'}};
      let result = QueryFilter.createQuery(sampleQueryFilterSchema, params);
      expect(JSON.stringify(result.where)).to.be.equal(
        JSON.stringify({'query_arr': {'$in': ['test1', 'test2']}})
      );
    });

  });
});