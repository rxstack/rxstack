export function parseRange(raw: string, size: number): { start: number, end: number, chunkSize: number } {
  const parts = raw.split(/bytes=([0-9]*)-([0-9]*)/);
  const start = parseInt(parts[1], 10);
  const end = parseInt(parts[2], 10);
  const result = { start: 0, end: 0, chunkSize: 0 };

  result.start = isNaN(start) ? 0 : start;
  result.end = isNaN(end) ? size - 1 : end;

  if (!isNaN(start) && isNaN(end)) {
    result.start = start;
    result.end = size - 1;
  }

  if (isNaN(start) && !isNaN(end)) {
    result.start =  size - end;
    result.end =  size - 1;
  }

  if (start >= size || end >= size) {
    return null;
  }
  result.chunkSize = (result.end - result.start) + 1;
  return result;
}
