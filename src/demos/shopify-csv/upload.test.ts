import { describe, expect, it, vi } from 'vitest';
import { MAX_CSV_BYTES, readCsvFile } from './upload';

describe('local file read boundary', () => {
  it('rejects oversized files before reading any bytes or producing validation results', async () => {
    const arrayBuffer = vi.fn().mockRejectedValue(new Error('must not read'));
    const outcome = await readCsvFile({ size: MAX_CSV_BYTES + 1, arrayBuffer });
    expect(arrayBuffer).not.toHaveBeenCalled();
    expect(outcome.result).toBeUndefined();
    expect(outcome.error).toContain('15,000,000 bytes');
    expect(outcome.error).toContain('Split it into smaller CSV files');
  });
  it.each([
    MAX_CSV_BYTES - 1,
    MAX_CSV_BYTES,
  ])('reads a file of %i bytes at or below the limit', async (size) => {
    const arrayBuffer = vi
      .fn()
      .mockResolvedValue(new TextEncoder().encode('Title\nLocal product').buffer);
    const outcome = await readCsvFile({ size, arrayBuffer });
    expect(arrayBuffer).toHaveBeenCalledOnce();
    expect(outcome.result).toEqual({ rows: 1, products: 1, findings: [] });
    expect(outcome.error).toBeUndefined();
  });
  it('keeps invalid UTF-8 as a read failure instead of validating replacement characters', async () => {
    await expect(
      readCsvFile({ size: 1, arrayBuffer: async () => new Uint8Array([255]).buffer }),
    ).rejects.toThrow();
  });
});
