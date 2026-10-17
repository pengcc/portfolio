import { describe, expect, it } from 'vitest';
import { convertJson, csvCell, example } from './convert';

describe('JSON to CSV', () => {
  it('preserves source order for integer-like keys across records', () => {
    expect(convertJson('[{"10":"ten","2":"two"},{"3":"three","10":"again"}]').csv).toBe(
      '10,2,3\r\nten,two,\r\nagain,,three\r\n',
    );
  });
  it('decodes escaped keys and keeps first key position with last duplicate value', () => {
    expect(convertJson(String.raw`[{"\u0031\u0030":"first","2":"two","10":"last"}]`).csv).toBe(
      '10,2\r\nlast,two\r\n',
    );
  });
  it.each([
    '9007199254740993',
    '-9007199254740993',
    '1e309',
    '-1e309',
    '1e-400',
    '0.123456789012345678901',
    '-0',
    '1.2300e+02',
    '9007199254740991',
  ])('exports numeric literal %s without rounding or normalization', (literal) => {
    const result = convertJson(`[{"value":${literal}}]`);
    expect(result.csv).toBe(`value\r\n${literal}\r\n`);
    expect(result.preview).toBe(result.csv);
  });
  it('preserves the review numeric reproduction verbatim', () => {
    expect(convertJson('[{"id":9007199254740993,"other":1e309}]').csv).toBe(
      'id,other\r\n9007199254740993,1e309\r\n',
    );
  });
  it('protects numeric-looking strings while preserving numeric literals', () => {
    expect(convertJson('[{"text":"-9007199254740993","number":-9007199254740993}]').csv).toBe(
      "text,number\r\n'-9007199254740993,-9007199254740993\r\n",
    );
  });
  it('does not treat punctuation, escaped quotes or number text in strings as tokens', () => {
    const row = { 'a"b': '},[: "quoted" \\ path\n1e309', next: true };
    expect(convertJson(JSON.stringify([row])).csv).toBe(
      '"a""b",next\r\n"},[: ""quoted"" \\ path\n1e309",true\r\n',
    );
  });
  it('rejects nested values even when a duplicate primitive would overwrite them', () => {
    expect(() => convertJson('[{"a":[],"a":1}]')).toThrow(
      'nested arrays and objects are unsupported',
    );
  });
  it.each([
    '[{"a":01}]',
    '[{"a":1e}]',
    '[{"a":NaN}]',
    '[{"a":1},]',
    '[{"a":1}] trailing',
  ])('validates complete JSON grammar before reading tokens: %s', (source) => {
    expect(() => convertJson(source)).toThrow('Invalid JSON');
  });
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
