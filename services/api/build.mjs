import { build } from 'esbuild'

await build({
  entryPoints: { main: 'src/main.ts', 'scrambles.worker': 'src/modules/rooms/scrambles.worker.ts' },
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  sourcemap: true,
  sourcesContent: false,
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" }
})
