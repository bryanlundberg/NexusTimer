import type { RedisClientType } from 'redis'

type Command = (...args: never[]) => Promise<unknown>

export function fakeRedis() {
  const sets = new Map<string, Set<string>>()
  const lists = new Map<string, string[]>()
  const strings = new Map<string, string>()
  const ttls = new Map<string, number>()
  const state = { down: false, failNextExec: false }

  const exists = (key: string) => sets.has(key) || lists.has(key) || strings.has(key)
  const asArray = (value: string | string[]) => (Array.isArray(value) ? value : [value])

  const commands = {
    async sMembers(key: string) {
      return [...(sets.get(key) ?? [])]
    },
    async sIsMember(key: string, member: string) {
      return sets.get(key)?.has(member) ? 1 : 0
    },
    async sAdd(key: string, members: string | string[]) {
      const set = sets.get(key) ?? new Set<string>()
      for (const member of asArray(members)) set.add(member)
      sets.set(key, set)
    },
    async sRem(key: string, member: string) {
      sets.get(key)?.delete(member)
    },
    async lRange(key: string, start: number, stop: number) {
      return (lists.get(key) ?? []).slice(start, stop === -1 ? undefined : stop + 1)
    },
    async lPush(key: string, values: string | string[]) {
      lists.set(key, [...asArray(values), ...(lists.get(key) ?? [])])
    },
    async rPush(key: string, values: string | string[]) {
      lists.set(key, [...(lists.get(key) ?? []), ...asArray(values)])
    },
    async lTrim(key: string, start: number, stop: number) {
      const list = lists.get(key)
      if (list) lists.set(key, list.slice(start, stop + 1))
    },
    async exists(key: string) {
      return exists(key) ? 1 : 0
    },
    async expire(key: string, seconds: number, mode?: 'NX') {
      if (!exists(key) || (mode === 'NX' && ttls.has(key))) return 0
      ttls.set(key, seconds)
      return 1
    },
    async get(key: string) {
      return strings.get(key) ?? null
    },
    async mGet(keys: string[]) {
      return keys.map((key) => strings.get(key) ?? null)
    },
    async set(key: string, value: string, options?: { EX?: number }) {
      strings.set(key, value)
      if (options?.EX) ttls.set(key, options.EX)
    },
    async incr(key: string) {
      const next = Number(strings.get(key) ?? 0) + 1
      strings.set(key, String(next))
      return next
    },
    async del(keys: string | string[]) {
      for (const key of asArray(keys)) {
        sets.delete(key)
        lists.delete(key)
        strings.delete(key)
        ttls.delete(key)
      }
    }
  } satisfies Record<string, Command>

  function multi() {
    const queued: (() => Promise<unknown>)[] = []
    const chain: Record<string, unknown> = {
      async exec() {
        if (state.failNextExec) {
          state.failNextExec = false
          throw new Error('exec failed')
        }
        const results: unknown[] = []
        for (const run of queued) results.push(await run())
        return results
      }
    }
    for (const [name, command] of Object.entries(commands)) {
      chain[name] = (...args: never[]) => {
        queued.push(() => (command as Command)(...args))
        return chain
      }
    }
    return chain
  }

  const client = { ...commands, multi } as unknown as RedisClientType
  const provider = () => (state.down ? Promise.reject(new Error('redis down')) : Promise.resolve(client))

  return { provider, state, sets, lists, strings, ttls }
}
