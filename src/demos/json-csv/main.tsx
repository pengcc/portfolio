import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { convertJson, example } from './convert';
import './styles.css';

function App() {
  const [source, setSource] = useState(example);
  const [message, setMessage] = useState('');
  const version = useRef(0);
  let result: ReturnType<typeof convertJson> | undefined;
  let error = '';
  try {
    result = convertJson(source);
  } catch (cause) {
    error = cause instanceof Error ? cause.message : 'Unable to convert input.';
  }
  function update(value: string) {
    version.current += 1;
    setSource(value);
    setMessage('');
  }
  async function loadFile(file: File | undefined) {
    if (!file) return;
    const current = ++version.current;
    setSource('');
    setMessage('Reading local file…');
    try {
      const text = await file.text();
      if (current !== version.current) return;
      setSource(text);
      setMessage(`Loaded ${file.name} locally.`);
    } catch {
      if (current === version.current) setMessage('Could not read this file. Try pasting JSON.');
    }
  }
  async function copy() {
    if (!result) return;
    const current = version.current;
    try {
      await navigator.clipboard.writeText(result.csv);
      if (current === version.current) setMessage('Full CSV copied.');
    } catch {
      if (current === version.current)
        setMessage('Clipboard unavailable. Use Download CSV instead.');
    }
  }
  function download() {
    if (!result) return;
    const url = URL.createObjectURL(new Blob([result.csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-data.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Full CSV download requested.');
  }
  return (
    <main>
      <a href="/">← Return to Portfolio</a>
      <p className="eyebrow">LOCAL DATA TOOL · DEMO</p>
      <h1>JSON → CSV</h1>
      <p>Turn a small array of flat objects into a spreadsheet-ready file.</p>
      <p className="muted">Your data stays in this page. No uploads, analytics, or storage.</p>
      <div className="workspace">
        <section aria-labelledby="input-title">
          <h2 id="input-title">1. Add JSON</h2>
          <p>
            Strings, numbers, booleans, and null supported. Nested objects and arrays are
            unsupported.
          </p>
          <label htmlFor="json-file">Load a local .json file</label>
          <input
            id="json-file"
            type="file"
            accept=".json,application/json"
            onChange={(event) => {
              void loadFile(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <label htmlFor="json-input">Or paste JSON</label>
          <textarea
            id="json-input"
            value={source}
            spellCheck={false}
            onChange={(event) => update(event.target.value)}
          />
          <button type="button" onClick={() => update(example)}>
            Load artificial example
          </button>
        </section>
        <section aria-labelledby="output-title">
          <h2 id="output-title">2. Inspect & export</h2>
          {error ? (
            <p role="alert" className="error">
              {error}
            </p>
          ) : null}
          {result ? (
            <>
              <p>
                {result.records} records · {result.columns} columns
              </p>
              <label htmlFor="csv-preview">CSV preview (header + first 5 records)</label>
              <textarea id="csv-preview" readOnly value={result.preview} spellCheck={false} />
            </>
          ) : null}
          <div className="actions">
            <button type="button" disabled={!result} onClick={() => void copy()}>
              Copy full CSV
            </button>
            <button type="button" disabled={!result} onClick={download}>
              Download CSV
            </button>
          </div>
          <p role="status">{message}</p>
          <p className="muted">
            Columns follow first-seen key order. Missing and null values become empty fields.
            Exports use UTF-8, commas, and CRLF record endings.
          </p>
          <p className="muted">
            Formula protection: string values and headers beginning with =, +, -, or @ (even after
            whitespace), or a tab/newline, receive a leading apostrophe. This deliberately changes
            those cells to text; numeric negatives stay numeric.
          </p>
        </section>
      </div>
      <footer>
        A self-contained demonstration inspired by public freelance demand. Artificial data; not a
        client delivery.
      </footer>
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');
createRoot(root).render(<App />);
