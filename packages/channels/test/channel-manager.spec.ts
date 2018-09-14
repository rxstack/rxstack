import {Channel} from '../src/channel';
import {ChannelManager} from '../src/channel-manager';

describe('Channel', () => {
  // Setup
  const channelManager = new ChannelManager();

  beforeEach(async() =>  {
    channelManager.reset();
  });

  it('should create channel', () => {
    const channel1 = channelManager.channel('test1');
    channel1.should.be.instanceOf(Channel);
    channel1.should.be.equal(channelManager.channel('test1'));
  });

  it('should combine channels', () => {
    const combined = channelManager.channels('test1', 'test2');
    combined.should.be.instanceOf(Channel);
    combined.children.length.should.be.equal(2);
    combined.ns.should.be.equal('test1_test2');
  });

  it('should remove channel', () => {
    const channel1 = channelManager.channel('test1');
    channelManager.removeChannel('test1');
    channelManager.hasChannel('test1').should.be.false;
  });
});
