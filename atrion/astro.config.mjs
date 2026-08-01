import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    // This project lives inside the Next.js repo; without this, Vite walks up
    // and picks up the parent app's postcss.config.js.
    css: { postcss: {} },
  },
});
