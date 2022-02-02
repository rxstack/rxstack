export type FilterType = '$in' | '$nin' | '$lt' | '$lte' | '$gt' | '$gte' | '$eq' | '$ne';
export type TransformCallable = (value: any) => any;
export interface SortInterface {
  [key: string]: 1|-1;
}

export interface QueryInterface {
  where: Record<string, any>;
  limit: number;
  skip: number;
  sort?: SortInterface;
}

export interface QueryFilterSchema {
  properties: {
    [propertyName: string]: {
      operators: FilterType[],
      property_path?: string,
      replace_operators?: [FilterType, any][],
      meta?: any,
      transformers?: TransformCallable[],
      sort?: boolean
    }
  };
  allowOrOperator?: boolean;
  replaceOrOperatorWith?: any;
  defaultLimit: number;
}
