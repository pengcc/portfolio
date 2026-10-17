import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: [
        fileURLToPath(new URL('./index.html', import.meta.url)),
        ...globSync('demos/*/index.html', {
          cwd: fileURLToPath(new URL('.', import.meta.url)),
        })
          .sort()
          .map((entry) => fileURLToPath(new URL(entry, import.meta.url))),
      ],
    },
  },
});
