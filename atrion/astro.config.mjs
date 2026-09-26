// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  env: {
    schema: {
      MONGODB_URI: envField.string({ context: 'server', access: 'secret' }),
      AUTH_SECRET: envField.string({ context: 'server', access: 'secret' }),
      ALLOWED_EMAIL: envField.string({ context: 'server', access: 'secret' }),
    },
    validateSecrets: true,
  },
  vite: {
    // This project lives inside the Next.js repo; without this, Vite walks up
    // and picks up the parent app's postcss.config.js.
    css: { postcss: {} },
  },
});
