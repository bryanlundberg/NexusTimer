import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const crate = `${root}crate`
const pkg = `${root}pkg`

execFileSync('cargo', ['build', '--release', '--lib', '--target', 'wasm32-unknown-unknown'], {
  cwd: crate,
  stdio: 'inherit'
})

rmSync(pkg, { recursive: true, force: true })
execFileSync(
  'wasm-bindgen',
  [
    '--target',
    'web',
    '--remove-name-section',
    '--remove-producers-section',
    '--out-dir',
    pkg,
    '--out-name',
    'tnoodle_lib_rs',
    `${crate}/target/wasm32-unknown-unknown/release/tnoodle_lib_rs.wasm`
  ],
  { stdio: 'inherit' }
)

const wasm = readFileSync(`${pkg}/tnoodle_lib_rs_bg.wasm`)
writeFileSync(`${pkg}/tnoodle_lib_rs_wasm.js`, `export default '${wasm.toString('base64')}'\n`)
writeFileSync(`${pkg}/tnoodle_lib_rs_wasm.d.ts`, 'declare const wasm: string\nexport default wasm\n')

console.log(`tnoodle_lib_rs_bg.wasm ${(wasm.length / 1024).toFixed(1)} KiB`)
