import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const OUTPUT = 'public/third-party-licenses.txt'
const LICENSE_FILE = /^(licen[sc]e|copying|notice)/i
const RULE = '='.repeat(78)

const HEADER = `NexusTimer third-party notices

NexusTimer is free software, licensed under the GNU General Public License,
version 3. Its source code is available at
https://github.com/bryanlundberg/NexusTimer

It includes or depends on the third-party software listed below. Each
component is the property of its authors and is distributed under its own
license, reproduced here.

Bundled source files:

- Smart cube and Stackmat drivers derived from csTimer
  (https://github.com/cs0x7f/cstimer), GPL-3.0. See
  public/vendors/cstimer/hardware/CREDITS.md in the repository.
- Scramble generation ported from tnoodle-lib
  (https://github.com/thewca/tnoodle-lib), GPL-3.0.
- DSEG7 Classic font by Keshikan (https://www.keshikan.net/fonts-e.html),
  SIL Open Font License 1.1.
`

function run(command) {
  return execSync(command, { encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] })
}

function licenseText(dir) {
  if (!existsSync(dir)) return null
  const files = readdirSync(dir)
    .filter((file) => LICENSE_FILE.test(file))
    .sort()
  if (files.length === 0) return null
  return files
    .map((file) => readFileSync(join(dir, file), 'utf-8').replace(/\r\n/g, '\n').trim())
    .join('\n\n')
}

function npmComponents() {
  const byLicense = JSON.parse(run('pnpm licenses list --prod --json'))
  return Object.values(byLicense)
    .flat()
    .filter((pkg) => !pkg.name.startsWith('@nexustimer/'))
    .flatMap((pkg) =>
      pkg.versions.map((version, i) => ({
        id: `${pkg.name}@${version}`,
        license: pkg.license,
        homepage: pkg.homepage,
        text: licenseText(pkg.paths[i] ?? pkg.paths[0])
      }))
    )
}

function cargoComponents() {
  const metadata = JSON.parse(run('cargo metadata --format-version 1 --manifest-path crates/Cargo.toml'))
  return metadata.packages
    .filter((pkg) => pkg.source !== null)
    .map((pkg) => ({
      id: `${pkg.name}@${pkg.version} (Rust crate)`,
      license: pkg.license,
      homepage: pkg.repository ?? pkg.homepage,
      text: licenseText(dirname(pkg.manifest_path))
    }))
}

const components = [...npmComponents(), ...cargoComponents()].sort((a, b) => a.id.localeCompare(b.id))

const groups = new Map()
for (const component of components) {
  const text = component.text ?? `License: ${component.license}. No license file is shipped with this package.`
  const group = groups.get(text) ?? []
  group.push(component)
  groups.set(text, group)
}

const sections = [...groups].map(([text, group]) => {
  const lines = group.map((c) => `${c.id} (${c.license})${c.homepage ? ` ${c.homepage}` : ''}`)
  return `${RULE}\n${lines.join('\n')}\n${RULE}\n\n${text}\n`
})

writeFileSync(OUTPUT, `${HEADER}\n${sections.join('\n')}`)
console.log(`${OUTPUT}: ${components.length} components, ${groups.size} distinct license texts`)
