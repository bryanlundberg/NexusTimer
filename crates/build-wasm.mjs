import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const workspace = fileURLToPath(new URL('.', import.meta.url))

export function buildWasm({ crate, pkg, base64 = false }) {
  const name = crate.replaceAll('-', '_')
  const out = fileURLToPath(pkg)

  execFileSync('cargo', ['build', '--release', '--lib', '--target', 'wasm32-unknown-unknown', '-p', crate], {
    cwd: workspace,
    stdio: 'inherit'
  })

  rmSync(out, { recursive: true, force: true })
  execFileSync(
    'wasm-bindgen',
    [
      '--target',
      'web',
      '--remove-name-section',
      '--remove-producers-section',
      '--out-dir',
      out,
      '--out-name',
      name,
      `${workspace}target/wasm32-unknown-unknown/release/${name}.wasm`
    ],
    { stdio: 'inherit' }
  )

  const wasm = readFileSync(`${out}/${name}_bg.wasm`)
  if (base64) {
    writeFileSync(`${out}/${name}_wasm.js`, `export default '${wasm.toString('base64')}'\n`)
    writeFileSync(`${out}/${name}_wasm.d.ts`, 'declare const wasm: string\nexport default wasm\n')
  }

  console.log(`${name}_bg.wasm ${(wasm.length / 1024).toFixed(1)} KiB`)
}
