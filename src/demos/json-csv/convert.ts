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
  // JSON.parse above validates the complete grammar, but its object enumeration
  // reorders integer keys and its numbers can round/overflow. Walk validated
  // source tokens instead; decode strings only and retain numeric lexemes.
  const tokens =
    source.match(
      /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/gu,
    ) ?? [];
  const columns = new Set<string>();
  const rows: Map<string, string>[] = [];
  let position = 1; // Skip the top-level opening bracket.
  while (tokens[position] !== ']') {
    if (tokens[position++] !== '{') {
      throw new Error(`Record ${rows.length + 1} must be an object.`);
    }
    const row = new Map<string, string>();
    while (tokens[position] !== '}') {
      const key: string = JSON.parse(tokens[position++]);
      position += 1; // Colon; grammar was already validated.
      const value = tokens[position++];
      if (value === '{' || value === '[') {
        throw new Error(
          `Record ${rows.length + 1}, column "${key}": nested arrays and objects are unsupported.`,
        );
      }
      columns.add(key);
      // Only a valid JSON number can begin with a minus or digit. All other
      // primitive tokens use the existing string/formula and CSV escaping policy.
      row.set(key, /^[-\d]/u.test(value) ? value : csvCell(JSON.parse(value)));
      if (tokens[position] === ',') position += 1;
    }
    rows.push(row);
    position += 1; // Closing object brace.
    if (tokens[position] === ',') position += 1;
  }
  const keys = [...columns];
  if (keys.length === 0)
    throw new Error('Include at least one column; empty objects have no CSV fields.');
  const lines = [keys.map(csvCell).join(',')];
  for (const row of rows) {
    lines.push(keys.map((key) => row.get(key) ?? '').join(','));
  }
  return {
    csv: `${lines.join('\r\n')}\r\n`,
    preview: `${lines.slice(0, 6).join('\r\n')}\r\n`,
    records: data.length,
    columns: keys.length,
  };
}
