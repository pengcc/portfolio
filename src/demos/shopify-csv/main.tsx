import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import sample from './fixtures/products-v1.csv?raw';
import { type Result, validateCsv } from './validator';
import './styles.css';

function App() {
  const [result, setResult] = useState<Result | null>(null);
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const request = useRef(0);
  function example() {
    request.current++;
    setBusy(false);
    setError('');
    setLabel('Synthetic products v1');
    setResult(validateCsv(sample));
  }
  async function readFile(file: File | undefined) {
    const id = ++request.current;
    setResult(null);
    setError('');
    setLabel(file ? 'Selected local CSV' : '');
    if (!file) {
      setBusy(false);
      return;
    }
    setBusy(true);
    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
      if (request.current === id) setResult(validateCsv(text));
    } catch {
      if (request.current === id)
        setError('Could not read this file as UTF-8. Export a UTF-8 CSV and try again.');
    } finally {
      if (request.current === id) setBusy(false);
    }
  }
  const errors = result?.findings.filter((item) => item.severity === 'error').length ?? 0;
  const warnings = result?.findings.filter((item) => item.severity === 'warning').length ?? 0;
  return (
    <main>
      <a href="/">← Portfolio</a>
      <p className="eyebrow">Local merchant tools / 01</p>
      <h1>Check your product CSV.</h1>
      <p>
        Spot common mistakes before a new-product import. Select a UTF-8 file to inspect it in your
        browser.
      </p>
      <section aria-labelledby="input-heading">
        <h2 id="input-heading">Choose a file</h2>
        <label htmlFor="csv-file">Product CSV (UTF-8)</label>
        <input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => void readFile(event.target.files?.[0])}
        />
        <button type="button" onClick={example}>
          Try synthetic example v1
        </button>
        <a
          download="products-v1.csv"
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(sample)}`}
        >
          Download example
        </a>
        <p>
          Files stay in this browser. No server upload, Shopify connection, or actual import/update.
        </p>
      </section>
      <div role="status" aria-live="polite">
        {busy && <p>Reading CSV…</p>}
        {error && <p className="error">{error}</p>}
        {result && (
          <section aria-labelledby="results-heading">
            <h2 id="results-heading">{label}</h2>
            <p>
              {result.rows} data rows · {result.products} product groups · {errors} errors ·{' '}
              {warnings} warnings
            </p>
            {result.findings.some((item) => item.kind === 'parse') && (
              <p>
                CSV structure failed. Product counts may be incomplete; fix parse errors before
                relying on rule checks.
              </p>
            )}
            {result.findings.length === 0 ? (
              <p>No issues found within this subset. This does not guarantee Shopify acceptance.</p>
            ) : (
              <div className="table-scroll">
                <table>
                  <caption>
                    Findings use physical source lines, including lines inside quoted cells.
                  </caption>
                  <thead>
                    <tr>
                      <th>Severity / type</th>
                      <th>Source line</th>
                      <th>Column</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.findings.map((finding) => (
                      <tr key={`${finding.row}-${finding.column}-${finding.message}`}>
                        <td>
                          {finding.severity} /{' '}
                          {finding.kind === 'parse' ? 'CSV parse' : 'product rule'}
                        </td>
                        <td>{finding.row}</td>
                        <td>{finding.column}</td>
                        <td>{finding.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
      <aside>
        <h2>Advisory, focused checks</h2>
        <p>
          This independent demo is not an official Shopify validator or an assurance of import
          acceptance. It checks a subset of product CSV fields: Title, URL handle, SKU, Price,
          Option1 name and Option1 value. It does not validate inventory CSVs, store updates,
          metafields, other options, or the full schema.
        </p>
        <p>
          Assumptions: rows for each product are contiguous and share a handle; a blank Title
          continues only the preceding handle. Custom options require a handle. SKU or option data
          requires a complete Option1 pair; use Default Title for simple products. Prices use
          nonnegative plain decimals. Blank SKUs are allowed; duplicate nonblank SKUs are advisory
          warnings.
        </p>
        <p>
          Uses current documented column names, checked 17 October 2026. Older templates may use
          different names. Other columns are ignored, not rejected.
        </p>
        <p>
          <a href="https://help.shopify.com/en/manual/products/import-export/using-csv">
            Shopify product CSV format
          </a>{' '}
          ·{' '}
          <a href="https://help.shopify.com/en/manual/products/import-export/import-products">
            Import behavior and dependencies
          </a>
        </p>
      </aside>
    </main>
  );
}
const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');
createRoot(root).render(<App />);
