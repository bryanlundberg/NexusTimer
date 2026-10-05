import { cpSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'out'
const DEFAULT_LOCALE = 'en'

const localeDir = join(OUT, DEFAULT_LOCALE)
if (!existsSync(localeDir)) throw new Error(`${localeDir} is missing; run next build first`)

cpSync(localeDir, OUT, { recursive: true, force: true })
cpSync(join(OUT, `${DEFAULT_LOCALE}.html`), join(OUT, 'index.html'))
cpSync(join(OUT, `${DEFAULT_LOCALE}.txt`), join(OUT, 'index.txt'))
