import 'reflect-metadata';
import {Sorter} from '../src/sorter';
import {data2} from './mocks/data';

describe('MemoryService:Sorter', () => {
  // Setup
  const sorter = new Sorter();

  it('#sort by price asc', () => {
    const result = data2.sort(sorter.sort({'price': 1}));
    result[0].name.should.equal('name3');
  });

  it('#sort by price desc', () => {
    const result = data2.sort(sorter.sort({'price': -1}));
    result[0].name.should.equal('name2');
  });

  it('#sort by price desc and name desc', () => {
    const result = data2.sort(sorter.sort({'price': -1, 'name': -1}));
    result[1].name.should.equal('name4');
  });
});
