// Run with pnpm dev at /src/demos/shopify-csv/browser-tests/index.html.
// Uses the actual React page and native File/FileList APIs; no browser-test dependencies.
import '../main';
import { MAX_CSV_BYTES } from '../upload';

async function until(check: () => boolean) {
  const deadline = performance.now() + 5000;
  while (!check()) {
    if (performance.now() > deadline) throw new Error('Timed out waiting for the rendered page');
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}
function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}
async function run() {
  await until(() => Boolean(document.querySelector('#csv-file')));
  const input = document.querySelector<HTMLInputElement>('#csv-file');
  const root = document.querySelector('#root');
  const example = Array.from(document.querySelectorAll('button')).find((button) =>
    button.textContent?.includes('Try synthetic example'),
  );
  if (!input || !root || !example) throw new Error('Missing app controls');
  const status = () => root.querySelector('[role="status"]')?.textContent ?? '';
  function select(file: File) {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (!input) throw new Error('Missing input');
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
  const local = new File(['Title\nLocal regression product'], 'regression.csv', {
    type: 'text/csv',
  });
  select(local);
  await until(() => status().includes('1 data rows'));
  assert(Boolean(input.value), 'Local selection should populate the native input');
  example.click();
  await until(() => status().includes('Synthetic products v1'));
  assert(
    input.value === '' && input.files?.length === 0,
    'Example must clear the native file selection',
  );
  select(local);
  await until(() => status().includes('Selected local CSV') && status().includes('1 data rows'));

  let read = false;
  const oversized = new File(['not read'], 'oversized.csv');
  Object.defineProperty(oversized, 'size', { value: MAX_CSV_BYTES + 1 });
  Object.defineProperty(oversized, 'arrayBuffer', {
    value: async () => {
      read = true;
      throw new Error('must not read');
    },
  });
  select(oversized);
  await until(() => status().includes('File exceeds this demo'));
  assert(!read, 'Oversized file must not be read');
  assert(
    !status().includes('data rows') && !status().includes('Reading CSV'),
    'Rejection must clear stale results and busy state',
  );
  select(local);
  await until(() => status().includes('1 data rows') && !status().includes('File exceeds'));
}
const report = document.querySelector('#test-result');
run()
  .then(() => {
    if (report)
      report.textContent =
        'PASS: local file → example → same file; oversized rejection without read; valid-file recovery.';
  })
  .catch((error: unknown) => {
    if (report) report.textContent = `FAIL: ${String(error)}`;
  });
