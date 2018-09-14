import {QueryFilterSchema} from '../src/interfaces';

export const convertToArray = function (value: string): string[] {
  return value.split(',');
};

export const sampleQueryFilterSchema: QueryFilterSchema = {
  'properties': {
    'query_name': {
      'property_path': 'db_name',
      'operators': ['$lt', '$lte', '$gt', '$gte', '$ne', '$eq'],
      'sort': true
    },
    'query_arr': {
      'property_path': 'query_arr',
      'operators': ['$in', '$nin'],
      'transformers': [convertToArray],
    },
    'id': {
      'property_path': 'id',
      'operators': ['$eq', '$lt'],
    },
    'not_used': {
      'property_path': 'not_used',
      'operators': [],
    },
  },
  'allowOrOperator': true,
  'defaultLimit': 10
};

export const sampleQueryFilterSchemaWithOrDisabled: QueryFilterSchema = {
  'properties': {
    'query_name': {
      'property_path': 'db_name',
      'operators': ['$lt', '$lte', '$gt', '$gte', '$ne', '$eq'],
      'sort': true
    },
  },
  'allowOrOperator': false,
  'defaultLimit': 10
};
