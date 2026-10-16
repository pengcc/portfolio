import { demoCatalog, isSafeDemoHref } from './demos/catalog';

export function App() {
  return (
    <div className="page">
      <header className="intro">
        <p className="eyebrow">Portfolio · Web development</p>
        <h1>Practical web demos</h1>
        <p className="summary">
          A lightweight home for small, useful tools and implementation examples. This is a
          bootstrap shell, not the finished site design.
        </p>
      </header>
      <main>
        <h2>Demos</h2>
        <ul className="demo-list">
          {demoCatalog.map((demo) => {
            const href = demo.status === 'live' && isSafeDemoHref(demo.href) ? demo.href : null;
            let statusLabel = 'Planned';
            if (demo.status === 'live') {
              statusLabel = href ? 'Open demo' : 'Unavailable';
            }

            return (
              <li key={demo.slug} className="demo">
                <div>
                  {href ? (
                    <h3>
                      <a href={href}>{demo.title}</a>
                    </h3>
                  ) : (
                    <h3>{demo.title}</h3>
                  )}
                  <p>{demo.description}</p>
                </div>
                <span className="demo-status">{statusLabel}</span>
              </li>
            );
          })}
        </ul>
      </main>
      <footer>Independent demos will be added and verified in separate pull requests.</footer>
    </div>
  );
}
