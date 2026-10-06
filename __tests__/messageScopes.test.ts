import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { toMerged } from 'es-toolkit'
import { get } from 'es-toolkit/compat'
import type { AbstractIntlMessages } from 'next-intl'
import { appMessages, landingMessages, shellMessages } from '@/shared/config/i18n/messageScopes'

const SRC = path.resolve(__dirname, '../src')
const ROUTES = path.join(SRC, 'app', '[locale]')
const ROUTE_FILE = /^(page|layout|not-found|error|loading|template|default)\.tsx?$/
const EXTENSIONS = ['', '.ts', '.tsx', '.js', '/index.ts', '/index.tsx', '/index.js']

const en: AbstractIntlMessages = JSON.parse(readFileSync(path.resolve(__dirname, '../messages/en.json'), 'utf8'))
const shell = shellMessages(en)

const SCOPES = {
  shell,
  landing: toMerged(shell, landingMessages(en)),
  app: toMerged(shell, appMessages(en))
}

type Scope = keyof typeof SCOPES

const scopeOf = (route: string): Scope => {
  const [first, ...rest] = path.relative(ROUTES, route).split(path.sep)
  if (first === '(with-sidebar)') return 'app'
  if (first === 'page.tsx' && rest.length === 0) return 'landing'
  return 'shell'
}

interface Usage {
  path: string
  exact: boolean
}

interface Module {
  client: boolean
  imports: string[]
  usages: Usage[]
}

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })

const resolveImport = (from: string, specifier: string): string | null => {
  const base = specifier.startsWith('@/')
    ? path.join(SRC, specifier.slice(2))
    : specifier.startsWith('.')
      ? path.join(path.dirname(from), specifier)
      : null
  if (!base) return null
  for (const extension of EXTENSIONS) {
    const candidate = base + extension
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return null
}

const findTopLevel = (code: string, from: number, stops: (char: string, next: string) => boolean): number => {
  let depth = 0
  let quote: string | null = null
  for (let i = from; i < code.length; i++) {
    const char = code[i]
    if (quote) {
      if (char === '\\') i++
      else if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') quote = char
    else if (depth === 0 && stops(char, code[i + 1])) return i
    else if ('([{'.includes(char)) depth++
    else if (')]}'.includes(char)) depth--
  }
  return -1
}

const firstArgument = (code: string, open: number): string => {
  const end = findTopLevel(code, open + 1, (char) => char === ',' || char === ')')
  return end === -1 ? '' : code.slice(open + 1, end)
}

const join = (namespace: string, key: string) => [namespace, key].filter(Boolean).join('.')

const keysOf = (namespace: string, argument: string): Usage[] => {
  const value = argument.trim()
  const literal = value.match(/^(['"])([^'"]*)\1$/)
  if (literal) return [{ path: join(namespace, literal[2]), exact: true }]
  if (value.startsWith('`') && value.endsWith('`')) {
    const template = value.slice(1, -1)
    const dynamicAt = template.indexOf('${')
    if (dynamicAt === -1) return [{ path: join(namespace, template), exact: true }]
    const prefix = template.slice(0, dynamicAt)
    return [{ path: join(namespace, prefix.slice(0, Math.max(prefix.lastIndexOf('.'), 0))), exact: false }]
  }
  const question = findTopLevel(value, 0, (char, next) => char === '?' && next !== '.' && next !== '?')
  const colon = question === -1 ? -1 : findTopLevel(value, question + 1, (char) => char === ':')
  if (colon !== -1) {
    return [...keysOf(namespace, value.slice(question + 1, colon)), ...keysOf(namespace, value.slice(colon + 1))]
  }
  return [{ path: namespace, exact: false }]
}

const modules = new Map<string, Module>()

const load = (file: string): Module => {
  const cached = modules.get(file)
  if (cached) return cached

  const code = readFileSync(file, 'utf8')
  const client = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*['"]use client['"]/.test(code)
  const specifiers = [
    ...code.matchAll(/(?:import|export)\s[^'";]*?from\s*['"]([^'"]+)['"]/g),
    ...code.matchAll(/import\s*['"]([^'"]+)['"]/g),
    ...code.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)
  ].map((match) => match[1])
  const imports = specifiers.map((specifier) => resolveImport(file, specifier)).filter((dep) => dep !== null)

  const usages: Usage[] = []
  const translators = [
    ...code.matchAll(/(?:const|let)\s+(\w+)\s*=\s*useTranslations\(\s*(?:['"]([^'"]*)['"])?\s*\)/g)
  ].map((match) => ({ name: match[1], namespace: match[2] ?? '', at: match.index }))
  for (const { name, namespace } of translators) usages.push({ path: namespace, exact: false })
  for (const name of new Set(translators.map((translator) => translator.name))) {
    for (const call of code.matchAll(new RegExp(`(?<![\\w.])${name}(?:\\.(?:rich|markup|raw))?\\(`, 'g'))) {
      const declaration = translators.findLast((translator) => translator.name === name && translator.at < call.index)
      if (!declaration) continue
      usages.push(...keysOf(declaration.namespace, firstArgument(code, call.index + call[0].length - 1)))
    }
  }

  const loaded = { client, imports, usages }
  modules.set(file, loaded)
  return loaded
}

const relativeToSrc = (file: string) => path.relative(SRC, file).replaceAll(path.sep, '/')

const clientUsages = (route: string) => {
  const found: Array<Usage & { file: string }> = []
  const seen = new Set<string>()
  const stack: Array<[string, boolean]> = [[route, false]]
  while (stack.length) {
    const [file, parentIsClient] = stack.pop()!
    const module = load(file)
    const client = parentIsClient || module.client
    const key = `${file}|${client}`
    if (seen.has(key)) continue
    seen.add(key)
    if (client) found.push(...module.usages.map((usage) => ({ ...usage, file: relativeToSrc(file) })))
    for (const dep of module.imports) stack.push([dep, client])
  }
  return found
}

const routes = walk(ROUTES).filter((file) => ROUTE_FILE.test(path.basename(file)))

describe('client message scopes', () => {
  it.each(routes.map((route) => [path.relative(ROUTES, route).replaceAll(path.sep, '/'), route]))(
    '%s only reads messages its scope sends to the client',
    (_, route) => {
      const scope = scopeOf(route)
      const missing = clientUsages(route)
        .filter((usage) => usage.path && get(SCOPES[scope], usage.path.split('.')) === undefined)
        .map((usage) => `${usage.file}: ${usage.path}${usage.exact ? '' : ' (dynamic)'}`)

      expect([...new Set(missing)], `missing from the ${scope} scope`).toEqual([])
    }
  )

  it('finds client translations in every scope', () => {
    const scopes = new Set(routes.filter((route) => clientUsages(route).length > 0).map(scopeOf))
    expect([...scopes].sort()).toEqual(['app', 'landing', 'shell'])
  })

  it('keeps server-only messages out of the app scope', () => {
    expect(get(SCOPES.app, ['Index', 'AlgorithmsPage', 'guides'])).toBeUndefined()
    expect(get(SCOPES.app, ['Index', 'AlgorithmsPage', 'title'])).toBeDefined()
  })
})
