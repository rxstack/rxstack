export type FilterType = '$in' | '$nin' | '$lt' | '$lte' | '$gt' | '$gte' | '$eq' | '$ne';
export type TransformFunc = (value: any) => any;
export interface Sort {
  [key: string]: 1|-1;
}

export interface QueryFilterResult {
  where: Object;
  limit: number;
  skip: number;
  sort?: Sort;
}

export interface QueryFilterSchema {
  properties: {
    [propertyName: string]: {
      property_path: string,
      operators: FilterType[],
      transformers?: TransformFunc[],
      sort?: boolean
    }
  };
  allowOrOperator?: boolean;
  defaultLimit: number;
}