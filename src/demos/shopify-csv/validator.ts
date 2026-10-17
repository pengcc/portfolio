export interface Finding {
  severity: 'error' | 'warning';
  kind: 'parse' | 'rule';
  row: number;
  column: string;
  message: string;
}
interface RecordRow {
  cells: string[];
  line: number;
}
export interface Result {
  rows: number;
  products: number;
  findings: Finding[];
}

/** Strict CSV state machine; line numbers refer to physical source lines, including quoted lines. */
export function parseCsv(source: string): RecordRow[] {
  const text = source.replace(/^\uFEFF/, '');
  const rows: RecordRow[] = [];
  let cells: string[] = [];
  let cell = '';
  let state: 'start' | 'plain' | 'quoted' | 'closed' = 'start';
  let line = 1;
  let start = 1;
  const finishCell = () => {
    cells.push(cell);
    cell = '';
    state = 'start';
  };
  const finishRow = () => {
    finishCell();
    rows.push({ cells, line: start });
    cells = [];
  };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const newline = c === '\r' || c === '\n';
    if (state === 'quoted') {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else state = 'closed';
      } else {
        cell += c;
        if (newline) {
          if (c === '\r' && text[i + 1] === '\n') cell += text[++i];
          line++;
        }
      }
    } else if (c === ',') finishCell();
    else if (newline) {
      finishRow();
      if (c === '\r' && text[i + 1] === '\n') i++;
      line++;
      start = line;
    } else if (c === '"' && state === 'start') state = 'quoted';
    else if (c === '"' || state === 'closed') {
      throw new Error(
        `Line ${line}, field ${cells.length + 1}: unexpected character near a quote. Escape quotes as two double-quotes and close quoted fields before a comma or newline.`,
      );
    } else {
      cell += c;
      state = 'plain';
    }
  }
  if (state === 'quoted')
    throw new Error(`Line ${start}, field ${cells.length + 1}: unclosed quoted field.`);
  if (state !== 'start' || cell || cells.length) finishRow();
  return rows;
}

export function validateCsv(source: string): Result {
  let records: RecordRow[];
  try {
    records = parseCsv(source);
  } catch (error) {
    const message = (error as Error).message;
    return {
      rows: 0,
      products: 0,
      findings: [
        {
          severity: 'error',
          kind: 'parse',
          row: Number(/Line (\d+)/.exec(message)?.[1] ?? 1),
          column: `Field ${/field (\d+)/.exec(message)?.[1] ?? '?'}`,
          message,
        },
      ],
    };
  }
  const findings: Finding[] = [];
  const add = (
    row: number,
    column: string,
    message: string,
    severity: 'error' | 'warning' = 'error',
    kind: 'parse' | 'rule' = 'rule',
  ) => findings.push({ row, column, message, severity, kind });
  const headers = records.shift()?.cells ?? [];
  if (!headers.includes('Title'))
    add(
      1,
      'Title',
      'Add the current-format Title column for new products. Older template names are outside this demo’s scope.',
    );
  const seenHeaders = new Set<string>();
  headers.forEach((header, i) => {
    if (!header || seenHeaders.has(header))
      add(
        1,
        `Field ${i + 1}`,
        'Use a nonblank, unique column header so values can be identified.',
        'error',
        'parse',
      );
    seenHeaders.add(header);
  });
  const data = records.filter(({ cells }) => cells.some((value) => value !== ''));
  const handles = new Set<string>();
  const skus = new Map<string, number>();
  let products = 0;
  let activeHandle = '';
  for (const { cells, line } of data) {
    if (cells.length !== headers.length) {
      add(
        line,
        'Record',
        `Expected ${headers.length} fields but found ${cells.length}. Check delimiters and quoting.`,
        'error',
        'parse',
      );
      continue;
    }
    const get = (name: string) => cells[headers.indexOf(name)] ?? '';
    const title = get('Title');
    const handle = get('URL handle');
    const continuation = Boolean(handle && handle === activeHandle);
    if (!continuation) {
      products++;
      if (!title.trim())
        add(
          line,
          'Title',
          'Provide a Title at the start of each new product. Only later rows with the same handle may omit it.',
        );
      if (handle && handles.has(handle))
        add(
          line,
          'URL handle',
          'Keep each product’s rows together; this handle appeared in an earlier group.',
        );
      if (handle) handles.add(handle);
    }
    activeHandle = handle;
    if (handle && !/^[\p{L}\p{N}-]+$/u.test(handle))
      add(
        line,
        'URL handle',
        'Use only letters, numbers and dashes, without spaces or URL prefixes.',
      );
    const name = get('Option1 name');
    const value = get('Option1 value');
    const sku = get('SKU');
    // A custom option signals a variant; Default Title is the simple-product convention.
    const customOption = Boolean(name && name !== 'Default Title');
    if ((continuation || customOption || !title.trim()) && !handle)
      add(line, 'URL handle', 'Supply a URL handle to associate variant rows with their product.');
    if (sku || name || value) {
      if (!name.trim())
        add(
          line,
          'Option1 name',
          'Supply Option1 name with SKU or option data (Default Title for a simple product).',
        );
      if (!value.trim())
        add(
          line,
          'Option1 value',
          'Supply Option1 value with SKU or option data (Default Title for a simple product).',
        );
    }
    if (continuation && !name && !value && (sku || get('Price')))
      add(line, 'Option1 name', 'Include option name and value to identify this variant.');
    const price = get('Price');
    if (price && !/^\d+(\.\d+)?$/.test(price))
      add(
        line,
        'Price',
        'Use a nonnegative decimal amount such as 9.99, without currency symbols, spaces or grouping separators.',
      );
    if (sku.trim()) {
      const previous = skus.get(sku);
      if (previous !== undefined)
        add(
          line,
          'SKU',
          `Duplicate SKU; also used on source line ${previous}. Confirm this is intentional. This advisory warning alone does not block import.`,
          'warning',
        );
      else skus.set(sku, line);
    }
  }
  if (!data.length) add(1, 'Record', 'Add at least one product row below the header.');
  return { rows: data.length, products, findings };
}
