import { type Result, validateCsv } from './validator';

// Decimal MB: a conservative, explicit browser memory bound for this advisory demo.
export const MAX_CSV_BYTES = 15_000_000;

type UploadResult = { result: Result; error?: never } | { error: string; result?: never };

export async function readCsvFile(file: Pick<File, 'size' | 'arrayBuffer'>): Promise<UploadResult> {
  if (file.size > MAX_CSV_BYTES) {
    return {
      error:
        'File exceeds this demo’s 15 MB limit (15,000,000 bytes) and was not read. Split it into smaller CSV files and check each separately. These checks remain advisory; acceptance is not guaranteed.',
    };
  }
  const text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
  return { result: validateCsv(text) };
}
