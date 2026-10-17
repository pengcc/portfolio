import { describe, expect, it } from 'vitest';
import { convertJson, csvCell, example } from './convert';

describe('JSON to CSV', () => {
  it('uses a first-seen union and empty fields for missing/null values', () => {
    expect(convertJson('[{"b":1,"a":null},{"c":true,"b":false}]').csv).toBe(
      'b,a,c\r\n1,,\r\nfalse,,true\r\n',
    );
  });
  it('quotes commas, quotes, CR/LF and preserves Unicode', () => {
    expect(convertJson(JSON.stringify([{ 'a,b': 'Renée, "hi"\r\n世界' }])).csv).toBe(
      '"a,b"\r\n"Renée, ""hi""\r\n世界"\r\n',
    );
  });
  it('does not inherit absent properties such as constructor', () => {
    expect(convertJson('[{"constructor":"value"},{}]').csv).toBe('constructor\r\nvalue\r\n\r\n');
  });
  it.each([
    'oops',
    '',
    '[',
    'null',
    '{}',
    '[]',
    '[{}]',
    '[1]',
    '[null]',
    '[[]]',
    '[{"a":{}}]',
    '[{"a":[]}]',
  ])('rejects invalid or unsupported input: %s', (source) => {
    expect(() => convertJson(source)).toThrow();
  });
  it('identifies nested input and the failing record', () => {
    expect(() => convertJson('[{}, {"x": []}]')).toThrow(
      'Record 2, column "x": nested arrays and objects are unsupported.',
    );
  });
  it.each([
    '=1+1',
    '+cmd',
    '-1',
    '@SUM(A1)',
    '  =1',
    '\ttext',
    '\rtext',
    '\ntext',
  ])('protects untrusted string %j', (value) => {
    expect(csvCell(value)).toBe(csvCell(`'${value}`));
  });
  it('protects headers and leaves negative numbers numeric', () => {
    expect(convertJson('[{"=1":-5,"normal":"-5"}]').csv).toBe("'=1,normal\r\n-5,'-5\r\n");
  });
  it('limits only preview, retaining all export rows', () => {
    const result = convertJson(JSON.stringify(Array.from({ length: 8 }, (_, n) => ({ n }))));
    expect(result.preview).toBe('n\r\n0\r\n1\r\n2\r\n3\r\n4\r\n');
    expect(result.csv).toContain('7\r\n');
    expect(result.records).toBe(8);
    expect(result.columns).toBe(1);
  });
  it('starts with a usable artificial example', () => {
    expect(convertJson(example).records).toBe(3);
  });
});
