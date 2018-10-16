import * as _ from 'lodash';
import {ComparisonCallback, SorterInterface} from './interfaces';
import {SortInterface} from '@rxstack/query-filter';
import {Injectable} from 'injection-js';

@Injectable()
export class Sorter implements SorterInterface {
  sort(sort: SortInterface): ComparisonCallback {
    return (first: Object, second: Object): number => {
      let comparator = 0;
      _.each(sort, (ord: any, key: string): void => {
        let modifier = parseInt(ord, 10);
        if (first[key] < second[key]) {
          comparator -= 1 * modifier;
        } else if (first[key] > second[key]) {
          comparator += 1 * modifier;
        }
      });
      return comparator;
    };
  }
}