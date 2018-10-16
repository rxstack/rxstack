import {SortInterface} from '@rxstack/query-filter';
import {InjectionToken} from 'injection-js';

export type FilterCallback = (current: any) => boolean;
export type ComparisonCallback = (first: Object, second: Object) => number;

export interface MatcherInterface {
  match(query: {[key: string]: any}): FilterCallback;
}

export interface SorterInterface {
  sort(condition: SortInterface): ComparisonCallback;
}

export const MATCHER_TOKEN = new InjectionToken<MatcherInterface[]>('MATCHER');
export const SORTER_TOKEN = new InjectionToken<MatcherInterface[]>('SORTER');