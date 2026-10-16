import { demoCatalog } from './demos/catalog';

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
        <h2>Planned demos</h2>
        <ul className="demo-list">
          {demoCatalog.map((demo) => (
            <li key={demo.slug} className="demo">
              <div>
                {demo.status === 'live' ? (
                  <h3>
                    <a href={demo.href}>{demo.title}</a>
                  </h3>
                ) : (
                  <h3>{demo.title}</h3>
                )}
                <p>{demo.description}</p>
              </div>
              <span className="demo-status">{demo.status === 'live' ? 'Open demo' : 'Planned'}</span>
            </li>
          ))}
        </ul>
      </main>
      <footer>Independent demos will be added and verified in separate pull requests.</footer>
    </div>
  );
}
