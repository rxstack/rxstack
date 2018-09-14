import {parseRange} from '../index';

describe('ParseRange', () => {
  it('should parse with first 1024 bytes', async () => {
    const result = parseRange('bytes=0-1023', 10000);
    result['start'].should.be.equal(0);
    result['end'].should.be.equal(1023);
    result['chunkSize'].should.be.equal(1024);
  });

  it('should parse without end position', async () => {
    const result = parseRange('bytes=1024-', 10000);
    result['start'].should.be.equal(1024);
    result['end'].should.be.equal(9999);
    result['chunkSize'].should.be.equal(8976);
  });

  it('should parse with last requested 512 bytes', async () => {
    const result = parseRange('bytes=-512', 10000);
    result['start'].should.be.equal(9488);
    result['end'].should.be.equal(9999);
    result['chunkSize'].should.be.equal(512);
  });

  it('should not parse with unavailable range', async () => {
    const result = parseRange('bytes=1000-100000000000', 10000);
    result.should.be.false;
  });
});