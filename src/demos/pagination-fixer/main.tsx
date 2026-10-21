import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  beginRefresh,
  duplicateCount,
  initialState,
  isCatalogOrder,
  type ListState,
  type PageNumber,
  type Product,
  receivePage,
  requestPage,
  stableProducts,
} from './model';
import './styles.css';

type Scenario = 'overlap' | 'rapid' | 'out-of-order' | 'stale';
interface TimelineEvent {
  id: number;
  text: string;
  stale: boolean;
}

const scenarioDetails: Record<Scenario, { title: string; description: string }> = {
  overlap: {
    title: 'Load overlapping pages',
    description:
      'The API repeats the final item from the previous page. Loading more should not duplicate it.',
  },
  rapid: {
    title: 'Refresh twice, quickly',
    description:
      'Refresh #2 finishes before refresh #1. The older reply must not restore stale data.',
  },
  'out-of-order': {
    title: 'Reverse response order',
    description:
      'Page 3 arrives before page 2. The list must still be complete and sorted by page.',
  },
  stale: {
    title: 'Refresh during pagination',
    description:
      'An old page-2 request returns after a fresh page 1. The old reply must be ignored.',
  },
};

function ProductPanel({
  mode,
  items,
  totalPages,
  ignored,
}: {
  mode: 'naive' | 'fixed';
  items: Product[];
  totalPages?: number;
  ignored?: number;
}) {
  const duplicates = duplicateCount(items);
  const ordered = isCatalogOrder(items);
  const seen = new Set<string>();
  const occurrences = new Map<string, number>();
  return (
    <section
      className={'result-panel ' + mode}
      aria-label={mode === 'naive' ? 'Buggy result' : 'Fixed result'}
    >
      <div className="panel-header">
        <div className="panel-type">
          <span className="panel-index">{mode === 'naive' ? '01 / BEFORE' : '02 / AFTER'}</span>
          <h2>{mode === 'naive' ? 'Append everything' : 'Merge with intent'}</h2>
          <p>
            {mode === 'naive'
              ? 'Every incoming response goes straight into the array.'
              : 'Current generation only · page order · unique IDs.'}
          </p>
        </div>
        <span className={'status-tag ' + (duplicates === 0 && ordered ? 'clean' : 'broken')}>
          {duplicates === 0 && ordered ? 'Consistent' : 'Data issue'}
        </span>
      </div>
      <div className="metrics">
        <div>
          <span>Rows rendered</span>
          <strong>{items.length}</strong>
        </div>
        <div>
          <span>Duplicate IDs</span>
          <strong className={duplicates ? 'bad-number' : 'good-number'}>{duplicates}</strong>
        </div>
        <div>
          <span>Page order</span>
          <strong className="metric-word">{ordered ? 'Correct' : 'Broken'}</strong>
        </div>
      </div>
      <div className="list-heading">
        <span>PRODUCT / SKU</span>
        <span>PRICE</span>
      </div>
      <div className="product-list">
        {items.map((product) => {
          const duplicate = seen.has(product.id);
          seen.add(product.id);
          const occurrence = (occurrences.get(product.id) ?? 0) + 1;
          occurrences.set(product.id, occurrence);
          return (
            <div
              className={'product-row' + (duplicate ? ' is-duplicate' : '')}
              key={product.id + '-' + occurrence}
            >
              <div className="product-icon" aria-hidden="true">
                {product.mark}
              </div>
              <div className="product-meta">
                <strong>{product.name}</strong>
                <span>
                  {product.id}{' '}
                  <span className="middle-dot" aria-hidden="true">
                    ·
                  </span>{' '}
                  {product.category}
                </span>
                {duplicate && <em>Duplicate ID</em>}
              </div>
              <div className="product-price">€{product.price.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
      <div className="panel-footer">
        {mode === 'fixed'
          ? 'Pages received: ' +
            (totalPages ?? 0) +
            ' / 3 · Stale replies ignored: ' +
            (ignored ?? 0)
          : 'No deduplication · No request version check'}
      </div>
    </section>
  );
}

function App() {
  const [state, setState] = useState<ListState>(initialState);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Scenario>('overlap');
  const [nextPage, setNextPage] = useState<PageNumber | 4>(2);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [message, setMessage] = useState('Both lists start with the same first five products.');
  const runId = useRef(0);
  const eventId = useRef(0);

  useEffect(
    () => () => {
      runId.current += 1;
    },
    [],
  );

  function log(text: string, stale = false) {
    const entry = { id: ++eventId.current, text, stale };
    setEvents((current) => [entry, ...current].slice(0, 7));
  }

  function reset() {
    runId.current += 1;
    setBusy(false);
    setState(initialState());
    setNextPage(2);
    setEvents([]);
    setSelected('overlap');
    setMessage('Reset to page 1. Try a scenario to see where the lists diverge.');
  }

  async function deliver(
    run: number,
    page: PageNumber,
    generation: number,
    delay: number,
    label: string,
    onComplete?: () => void,
  ) {
    const response = await requestPage(page, generation, delay);
    if (run !== runId.current) return;
    setState((current) => receivePage(current, response));
    const stale = generation !== (selectedGeneration.current ?? 0);
    log(
      label +
        ' · ' +
        response.products.length +
        ' records received' +
        (stale ? ' · FIXED IGNORES' : ''),
      stale,
    );
    onComplete?.();
  }

  // The generation for the running scenario is tracked independently of React batching.
  const selectedGeneration = useRef<number | null>(0);

  async function play(scenario: Scenario) {
    if (busy) return;
    const run = ++runId.current;
    setSelected(scenario);
    setBusy(true);
    setEvents([]);
    setState(initialState());
    setNextPage(2);
    selectedGeneration.current = 0;
    log('Reset both lists to the same starting data.');

    if (scenario === 'overlap') {
      setMessage('Requesting page 2, then page 3. Both contain overlapping product IDs.');
      await deliver(run, 2, 0, 230, 'Page 2');
      await deliver(run, 3, 0, 460, 'Page 3');
    } else if (scenario === 'rapid') {
      const refreshed = beginRefresh(beginRefresh(initialState()));
      selectedGeneration.current = refreshed.generation;
      setState(refreshed);
      setMessage('Two refreshes dispatched. The second reply arrives first.');
      log('Refresh #1 and #2 requested (generations 1 and 2).');
      await Promise.all([
        deliver(run, 1, 1, 850, 'Refresh #1'),
        deliver(run, 1, 2, 280, 'Refresh #2'),
      ]);
    } else if (scenario === 'out-of-order') {
      setMessage('Page 3 returns before page 2. The fixed list holds page 3 until page 2 arrives.');
      log('Requested page 2 (slow) and page 3 (fast).');
      await Promise.all([deliver(run, 2, 0, 820, 'Page 2'), deliver(run, 3, 0, 220, 'Page 3')]);
    } else {
      const refreshing = beginRefresh(initialState());
      selectedGeneration.current = refreshing.generation;
      setState(refreshing);
      setMessage('A page-2 request was started before refresh. Its late reply is now stale.');
      log('Old page 2 in flight; refresh requested (generation 1).');
      await Promise.all([
        deliver(run, 2, 0, 820, 'Old page 2'),
        deliver(run, 1, 1, 230, 'New page 1'),
      ]);
    }
    if (run === runId.current) {
      setBusy(false);
      log('Simulation complete.');
    }
  }

  async function loadNext() {
    if (busy || nextPage === 4) return;
    const page = nextPage;
    const generation = state.generation;
    const run = ++runId.current;
    selectedGeneration.current = generation;
    setSelected('overlap');
    setBusy(true);
    setMessage('Fetching page ' + page + ' with one repeated ID from the previous page.');
    log('Requested page ' + page + '.');
    await deliver(run, page, generation, 450, 'Page ' + page, () => {
      setNextPage(page === 2 ? 3 : 4);
    });
    if (run === runId.current) setBusy(false);
  }

  const fixed = stableProducts(state);
  const badDuplicates = duplicateCount(state.naive);
  const pendingGap = Boolean(state.pages[3] && !state.pages[2]);

  return (
    <main className="page">
      <header className="topbar">
        <a className="home-link" href="/">
          ↖ Portfolio
        </a>
        <span className="top-label">
          <span className="live-dot" /> INTERACTIVE CASE STUDY
        </span>
        <a
          className="source-link"
          href="https://github.com/pengcc/portfolio/tree/main/src/demos/pagination-fixer"
        >
          View source ↗
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            ENGINEERING LAB <span>—</span> 004 / DATA INTEGRITY
          </p>
          <h1>
            Same API.
            <br />
            <i>Different outcome.</i>
          </h1>
          <p className="lead">
            Duplicate products after pull-to-refresh? Pages that arrive out of order? Explore how a
            naive React list breaks—and how a predictable merge keeps it intact.
          </p>
          <div className="hero-pills">
            <span>React + TypeScript</span>
            <span>Simulated async API</span>
            <span>Zero backend</span>
          </div>
        </div>
        <div className="hero-aside">
          <p className="aside-top">THE PROBLEM</p>
          <strong>
            01 <span>/</span> 02
          </strong>
          <div className="aside-divider" />
          <p>One incoming response.</p>
          <p>Two very different ways to update state.</p>
          <span className="aside-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </section>

      <section className="lab" aria-labelledby="lab-title">
        <div className="lab-heading">
          <div>
            <p className="eyebrow">THE EXPERIMENT</p>
            <h2 id="lab-title">Break it. Then watch the fix.</h2>
            <p>Select a failure case. Every preset starts from the same 5 products.</p>
          </div>
          <button type="button" className="reset-button" onClick={reset}>
            ↺ Reset lists
          </button>
        </div>

        <div className="scenario-grid">
          {(['overlap', 'rapid', 'out-of-order', 'stale'] as const).map((scenario, index) => (
            <button
              className={'scenario-card' + (selected === scenario ? ' selected' : '')}
              type="button"
              key={scenario}
              disabled={busy}
              aria-pressed={selected === scenario}
              onClick={() => void play(scenario)}
            >
              <span className="scenario-number">{String(index + 1).padStart(2, '0')}</span>
              <strong>
                {scenarioDetails[scenario].title} <span aria-hidden="true">↗</span>
              </strong>
              <small>{scenarioDetails[scenario].description}</small>
            </button>
          ))}
        </div>

        <div className="run-status">
          <div className="status-copy">
            <span className={'run-indicator' + (busy ? ' running' : '')} aria-hidden="true" />
            <p role="status">{busy ? 'SIMULATING' : 'READY'} <span>· {message}</span></p>
          </div>
          <button type="button" className="load-button" disabled={busy || nextPage === 4} onClick={() => void loadNext()}>
            {nextPage === 4 ? 'All pages loaded ✓' : 'Manually load page ' + nextPage + ' →'}
          </button>
        </div>

        <div className="comparison">
          <ProductPanel mode="naive" items={state.naive} />
          <ProductPanel mode="fixed" items={fixed} totalPages={Object.keys(state.pages).length} ignored={state.staleIgnored} />
        </div>
        <div className="verdict" aria-live="polite">
          <span className="verdict-icon" aria-hidden="true">◎</span>
          <p>
            <strong>{badDuplicates > 0 || !isCatalogOrder(state.naive) ? 'The difference is visible.' : 'Both lists match so far.'}</strong>{' '}
            Naive: {badDuplicates} duplicate IDs. Fixed: {duplicateCount(fixed)} duplicate IDs.
            {pendingGap ? ' Page 3 is buffered until page 2 arrives.' : ''}
          </p>
        </div>

        <section className="timeline" aria-labelledby="timeline-title">
          <div className="timeline-title"><h2 id="timeline-title">Request timeline</h2><span>NEWEST FIRST / LOCAL SIMULATION</span></div>
          {events.length === 0 ? (
            <p className="timeline-empty">No new requests yet. Choose an experiment or load another page.</p>
          ) : (
            <ol className="event-list">
              {events.map((entry) => (
                <li key={entry.id} className={entry.stale ? 'stale-event' : ''}>
                  <span aria-hidden="true">{entry.stale ? '×' : '↳'}</span> {entry.text}
                </li>
              ))}
            </ol>
          )}
        </section>
      </section>

      <footer className="footer">
        <div>
          <strong>Why the fix works</strong>
          <p>Deduplicate by stable product ID, keep page order, and reject responses from older refresh generations. Keep existing data visible while refreshing.</p>
        </div>
        <p>All products and timing are synthetic. No external API, customer data or real transactions.</p>
        <a href="https://www.upwork.com/jobs/~022112549217973400375">Inspired by a reported freelance problem ↗</a>
      </footer>
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');
createRoot(root).render(<App />);
