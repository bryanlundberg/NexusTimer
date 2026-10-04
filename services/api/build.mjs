import { build } from 'esbuild'
import { readFile } from 'node:fs/promises'

const { dependencies } = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'))
const external = Object.entries(dependencies)
  .filter(([, version]) => !version.startsWith('workspace:'))
  .map(([name]) => name)

await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/main.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node24',
  sourcemap: true,
  external
})
