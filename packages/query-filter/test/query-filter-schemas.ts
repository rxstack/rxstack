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
    'param_without_property_path': {
      'operators': ['$eq'],
      'sort': true
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

export const sampleQueryFilterSchemaWithOrReplaced: QueryFilterSchema = {
  'properties': {
    'query_name': {
      'property_path': 'db_name',
      'operators': ['$eq'],
      'sort': true
    },
  },
  'allowOrOperator': true,
  'replaceOrOperatorWith': Symbol('or'),
  'defaultLimit': 10
};

export const sampleQueryFilterSchemaWithCustomOperator: QueryFilterSchema = {
  'properties': {
    'query_name': {
      'operators': ['$eq', '$ne'],
      'replace_operators': [['$eq', '$custom1'], ['$ne', '$custom2']],
      'sort': true
    },
  },
  'allowOrOperator': false,
  'defaultLimit': 10
};
