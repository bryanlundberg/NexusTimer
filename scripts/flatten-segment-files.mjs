import { readdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'out'
const SEGMENT_PREFIX = '__next.'

const filesIn = (dir, parts = []) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesIn(join(dir, entry.name), [...parts, entry.name]) : [[...parts, entry.name]]
  )

function flatten(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const path = join(dir, entry.name)
    if (!entry.name.startsWith(SEGMENT_PREFIX)) {
      flatten(path)
      continue
    }
    for (const parts of filesIn(path)) renameSync(join(path, ...parts), join(dir, [entry.name, ...parts].join('.')))
    rmSync(path, { recursive: true })
  }
}

flatten(OUT)
