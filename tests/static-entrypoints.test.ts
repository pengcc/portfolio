import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'vite';
import { expect, test } from 'vitest';

test('builds the homepage and automatically discovered demo HTML entries', async () => {
  const root = mkdtempSync(resolve('node_modules/.static-entrypoints-'));
  try {
    copyFileSync('vite.config.ts', resolve(root, 'vite.config.ts'));
    writeFileSync(resolve(root, 'index.html'), '<h1>Portfolio fixture</h1>');
    for (const slug of ['first-demo', 'second-demo']) {
      mkdirSync(resolve(root, `demos/${slug}`), { recursive: true });
      mkdirSync(resolve(root, `src/demos/${slug}`), { recursive: true });
      writeFileSync(
        resolve(root, `demos/${slug}/index.html`),
        `<h1>${slug}</h1><script type="module" src="/src/demos/${slug}/main.ts"></script>`,
      );
      writeFileSync(
        resolve(root, `src/demos/${slug}/main.ts`),
        `document.body.dataset.demo = '${slug}';`,
      );
    }
    await build({ root, logLevel: 'silent' });
    expect(readFileSync(resolve(root, 'dist/index.html'), 'utf8')).toContain('Portfolio fixture');
    for (const slug of ['first-demo', 'second-demo']) {
      const html = readFileSync(resolve(root, `dist/demos/${slug}/index.html`), 'utf8');
      expect(html).toContain(`<h1>${slug}</h1>`);
      const asset = html.match(/src="(\/assets\/[^"]+\.js)"/);
      expect(asset).not.toBeNull();
      expect(readFileSync(resolve(root, `dist${asset?.[1]}`), 'utf8')).toContain(slug);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 30_000);
