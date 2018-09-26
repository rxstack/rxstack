export type FilterType = '$in' | '$nin' | '$lt' | '$lte' | '$gt' | '$gte' | '$eq' | '$ne';
export type TransformCallable = (value: any) => any;
export interface SortInterface {
  [key: string]: 1|-1;
}

export interface QueryInterface {
  where: Object;
  limit: number;
  skip: number;
  sort?: SortInterface;
}

export interface QueryFilterSchema {
  properties: {
    [propertyName: string]: {
      property_path: string,
      operators: FilterType[],
      meta?: any,
      transformers?: TransformCallable[],
      sort?: boolean
    }
  };
  allowOrOperator?: boolean;
  defaultLimit: number;
}