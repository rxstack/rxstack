import {describe, expect, it} from '@jest/globals';
import {parseRange} from '../index';

describe('ParseRange', () => {
  it('should parse with first 1024 bytes', async () => {
    const result = parseRange('bytes=0-1023', 10000);
    expect(result['start']).toBe(0);
    expect(result['end']).toBe(1023);
    expect(result['chunkSize']).toBe(1024);
  });

  it('should parse without end position', async () => {
    const result = parseRange('bytes=1024-', 10000);
    expect(result['start']).toBe(1024);
    expect(result['end']).toBe(9999);
    expect(result['chunkSize']).toBe(8976);
  });

  it('should parse with last requested 512 bytes', async () => {
    const result = parseRange('bytes=-512', 10000);
    expect(result['start']).toBe(9488);
    expect(result['end']).toBe(9999);
    expect(result['chunkSize']).toBe(512);
  });

  it('should not parse with unavailable range', async () => {
    const result = parseRange('bytes=1000-100000000000', 10000);
    expect(null === result).toBeTruthy();
  });
});
