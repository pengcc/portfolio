import { demoCatalog, isSafeDemoHref } from './demos/catalog';

export function App() {
  return (
    <div className="page">
      <header className="intro">
        <p className="eyebrow">INDEPENDENT WEB DEMOS</p>
        <h1>Small tools for real-world tasks.</h1>
        <p className="summary">
          Explore practical browser-based tools for converting data and checking CSV files. Try the
          demos or inspect how they're built.
        </p>
      </header>
      <main id="demos" aria-labelledby="demos-heading">
        <h2 id="demos-heading">Live demos</h2>
        <ul className="demo-list">
          {demoCatalog
            .filter((demo) => demo.status === 'live')
            .map((demo) => (
              <li key={demo.slug} className="demo">
                <h3>{demo.title}</h3>
                <p>{demo.description}</p>
                <div className="demo-actions">
                  {isSafeDemoHref(demo.href) ? (
                    <a
                      className="primary-link"
                      href={demo.href}
                      aria-label={`Open demo: ${demo.title}`}
                    >
                      Open demo <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span>Unavailable</span>
                  )}
                  {isSafeDemoHref(demo.sourceHref) && (
                    <a href={demo.sourceHref} aria-label={`View source: ${demo.title}`}>
                      View source
                    </a>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </main>
      <footer>
        <p>Independent web demos. Practical tools, open source.</p>
        <a href="https://github.com/pengcc/portfolio">Project on GitHub</a>
      </footer>
    </div>
  );
}
