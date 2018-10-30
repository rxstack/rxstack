import {QueryFilterSchema} from '@rxstack/query-filter';

export const taskQuerySchema: QueryFilterSchema = {
  'properties': {
    'name': {
      'property_path': 'name',
      'operators': ['$in', '$eq'],
      'sort': true
    },
    'completed': {
      'property_path': 'completed',
      'operators': ['$eq'],
      'transformers': [
        (value: any) => value === 'true' ? true : false
      ],
      'sort': true
    }
  },
  'allowOrOperator': false,
  'defaultLimit': 10
};
