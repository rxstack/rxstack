import {SortInterface} from '@rxstack/query-filter';
import {InjectionToken} from 'injection-js';
import {ServiceOptions} from '@rxstack/platform';

export type FilterCallback = (current: any) => boolean;
export type ComparisonCallback = (first: Object, second: Object) => number;

export interface MatcherInterface {
  match(query: {[key: string]: any}): FilterCallback;
}

export interface SorterInterface {
  sort(condition: SortInterface): ComparisonCallback;
}

export interface MemoryServiceOptions extends ServiceOptions {
  collectionName: string;
}

export const MATCHER_TOKEN = new InjectionToken<MatcherInterface>('MATCHER');
export const SORTER_TOKEN = new InjectionToken<SorterInterface>('SORTER');