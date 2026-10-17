import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseCsv, validateCsv } from './validator';

const sample = readFileSync(new URL('./fixtures/products-v1.csv', import.meta.url), 'utf8');
const header = 'Title,URL handle,SKU,Price,Option1 name,Option1 value\n';

describe('CSV parsing', () => {
  it('preserves quoted commas, escaped quotes, multiline fields, BOM and CRLF', () => {
    expect(
      parseCsv(
        '\uFEFFTitle,Description\r\n"Mug, small","A ""quote""\r\nand more"\r\nNext,plain\r\n',
      ),
    ).toEqual([
      { line: 1, cells: ['Title', 'Description'] },
      { line: 2, cells: ['Mug, small', 'A "quote"\r\nand more'] },
      { line: 4, cells: ['Next', 'plain'] },
    ]);
  });
  it.each([
    'Title\n"Unclosed',
    'Title\nBad"quote',
    'Title\n"Closed"suffix',
  ])('distinguishes malformed quotes from rule errors: %s', (source) => {
    expect(validateCsv(source).findings[0].kind).toBe('parse');
  });
  it('reports ragged rows and ambiguous headers as parse errors', () => {
    expect(validateCsv('Title,Price\nMug,1,2').findings[0]).toMatchObject({
      row: 2,
      kind: 'parse',
    });
    expect(validateCsv('Title,Title\nA,B').findings[0].kind).toBe('parse');
  });
  it('accepts a trailing empty field without a final newline', () => {
    expect(parseCsv('Title,Price\nMug,')[1].cells).toEqual(['Mug', '']);
  });
});

describe('focused new-product checks', () => {
  it('accepts the versioned simple and multi-variant synthetic fixture', () => {
    expect(validateCsv(sample)).toEqual({ rows: 4, products: 3, findings: [] });
  });
  it('requires only Title for a simple new product', () => {
    expect(validateCsv('Title\nMug').findings).toEqual([]);
    expect(validateCsv('Price\n9.99').findings).toContainEqual(
      expect.objectContaining({ column: 'Title', kind: 'rule' }),
    );
  });
  it('permits blank Title for contiguous variants and requires Title at a new handle', () => {
    expect(
      validateCsv(`${header}Shirt,shirt,S,10,Size,Small\n,shirt,M,10,Size,Medium`).findings,
    ).toEqual([]);
    expect(
      validateCsv(`${header}Shirt,shirt,S,10,Size,Small\n,other,M,10,Size,Medium`).findings,
    ).toContainEqual(expect.objectContaining({ row: 3, column: 'Title' }));
  });
  it('requires handles for custom variants and does not carry a product across blank handles', () => {
    expect(validateCsv(`${header}Shirt,,S,10,Size,Small`).findings).toContainEqual(
      expect.objectContaining({ column: 'URL handle' }),
    );
    expect(
      validateCsv(`${header}Shirt,shirt,S,10,Size,Small\n,,M,10,Size,Medium`).findings.map(
        (f) => f.column,
      ),
    ).toEqual(expect.arrayContaining(['Title', 'URL handle']));
  });
  it('requires option columns for supplied SKU but allows blank SKUs', () => {
    expect(validateCsv(`${header}Mug,,MUG,10,,`).findings.map((f) => f.column)).toEqual([
      'Option1 name',
      'Option1 value',
    ]);
    expect(validateCsv(`${header}Mug,,,10,,`).findings).toEqual([]);
  });
  it.each([
    '$9.99',
    '1,000',
    '-1',
    'NaN',
    '1e3',
    ' 9.99',
  ])('rejects invalid supplied price %s', (price) => {
    expect(validateCsv(`${header}Mug,,,"${price}",,`).findings).toContainEqual(
      expect.objectContaining({ column: 'Price', severity: 'error' }),
    );
  });
  it.each(['0', '9.99', '12', ''])('accepts price %s', (price) => {
    expect(validateCsv(`${header}Mug,,,${price},,`).findings).toEqual([]);
  });
  it('reports invalid handles', () => {
    expect(validateCsv('Title,URL handle\nMug,bad handle').findings[0].column).toBe('URL handle');
  });
  it('warns about duplicate nonblank SKUs, linking the first source line', () => {
    const result = validateCsv(
      `${header}Mug,mug,SAME,10,Default Title,Default Title\nCup,cup,SAME,10,Default Title,Default Title`,
    );
    expect(result.findings).toEqual([
      expect.objectContaining({
        severity: 'warning',
        row: 3,
        column: 'SKU',
        message: expect.stringContaining('line 2'),
      }),
    ]);
  });
  it('keeps physical source locations after multiline content and ignores unknown columns', () => {
    expect(
      validateCsv('Title,Description,Price\n"Two\nlines",anything,$3').findings[0],
    ).toMatchObject({ row: 2, column: 'Price' });
    expect(validateCsv('Title,Custom field\nMug,anything').findings).toEqual([]);
  });
  it('flags noncontiguous repeated handles and empty files', () => {
    expect(validateCsv('Title,URL handle\nA,a\nB,b\nA,a').findings[0].column).toBe('URL handle');
    expect(validateCsv('').findings.length).toBeGreaterThan(0);
  });
});
