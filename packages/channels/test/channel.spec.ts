import {Channel} from '../src/channel';
import {EventEmitter} from 'events';
import {Connection, FilterFn} from '../src/interfaces';

describe('Channel', () => {
  // Setup
  const channel1 = new Channel('test1');
  const channel2 = new Channel('test2');
  const parent = new Channel('test1_test2');
  const conn1 = new EventEmitter();
  const conn2 = new EventEmitter();
  const conn3 = new EventEmitter();

  beforeEach(async() =>  {
    channel1.join(conn1, conn2);
    channel2.join(conn1);
  });

  afterEach(async() =>  {
    parent.reset();
    channel1.reset();
    channel2.reset();
  });

  it('should join', () => {
    channel1.length.should.be.equal(2);
    channel1.join(conn1).should.be.instanceOf(Channel);
    channel1.length.should.be.equal(2);
  });

  it('should leave', () => {
    channel1.leave(conn1).should.be.instanceOf(Channel);
    channel1.length.should.be.equal(1);
    channel1.leave(conn1);
    channel1.length.should.be.equal(1);
  });

  it('should send', (done) => {
    conn1.on('notify', (data: any) => {
      data.should.be.equal('something');
      done();
    });
    channel1.send('notify', 'something').should.be.instanceOf(Channel);
  });

  it('should send with filter function', (done) => {
    conn2.on('notify', (data: any) => {
      data.should.be.equal('something');
      done();
    });
    const fn: FilterFn = (connection: Connection) => connection === conn2;
    channel1.send('notify', 'something', fn).should.be.instanceOf(Channel);
  });

  describe('Parent', () => {
    it('should merge children', () => {
      parent.merge(channel1, channel2).should.be.instanceOf(Channel);
      parent.children.length.should.be.equal(2);
      parent.length.should.be.equal(2);
      parent.merge(channel1).children.length.should.be.equal(2);
    });

    it('should join', () => {
      parent.merge(channel1, channel2);
      parent.join(conn3).length.should.be.equal(3);
      channel1.length.should.be.equal(3);
      channel2.length.should.be.equal(2);
    });

    it('should leave', () => {
      parent.merge(channel1, channel2);
      parent.leave(conn2).length.should.be.equal(1);
      channel1.length.should.be.equal(1);
      channel2.length.should.be.equal(1);
    });

    it('should refresh', () => {
      parent.merge(channel1, channel2);
      channel1.join(conn3);
      channel1.length.should.be.equal(3);
      parent.refresh().length.should.be.equal(3);
      channel1.refresh().length.should.be.equal(3);
    });
  });
});
