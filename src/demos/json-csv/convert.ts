export const example = JSON.stringify(
  [
    { name: 'Mira', city: 'Berlin', active: true },
    { name: 'Renée', city: 'Montréal', active: false, note: 'Hello, world!' },
    { name: 'Kai', city: null, note: 'An artificial example' },
  ],
  null,
  2,
);

// Protect strings AND headers, including formula markers hidden behind whitespace.
// Numeric negatives remain numbers. Apostrophes are part of the exported data.
export function csvCell(value: unknown): string {
  let text = value == null ? '' : String(value);
  if (typeof value === 'string' && (/^[\s]*[=+\-@]/u.test(text) || /^[\t\r\n]/u.test(text))) {
    text = `'${text}`;
  }
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function convertJson(source: string) {
  let data: unknown;
  try {
    data = JSON.parse(source);
  } catch {
    throw new Error('Invalid JSON. Paste a valid JSON array of flat objects.');
  }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Use a nonempty top-level array of flat objects.');
  }
  const columns = new Set<string>();
  for (const [index, row] of data.entries()) {
    if (row === null || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error(`Record ${index + 1} must be an object.`);
    }
    for (const [key, value] of Object.entries(row)) {
      if (value !== null && typeof value === 'object') {
        throw new Error(
          `Record ${index + 1}, column "${key}": nested arrays and objects are unsupported.`,
        );
      }
      columns.add(key);
    }
  }
  const keys = [...columns];
  if (keys.length === 0)
    throw new Error('Include at least one column; empty objects have no CSV fields.');
  const lines = [keys.map(csvCell).join(',')];
  for (const row of data) {
    lines.push(keys.map((key) => csvCell(Object.hasOwn(row, key) ? row[key] : null)).join(','));
  }
  return {
    csv: `${lines.join('\r\n')}\r\n`,
    preview: `${lines.slice(0, 6).join('\r\n')}\r\n`,
    records: data.length,
    columns: keys.length,
  };
}
