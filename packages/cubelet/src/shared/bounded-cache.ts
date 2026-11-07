export class BoundedCache<K, V> {
  readonly #entries = new Map<K, V>()

  constructor(private readonly capacity: number) {}

  get(key: K): V | undefined {
    const value = this.#entries.get(key)
    if (value === undefined) return undefined
    this.#entries.delete(key)
    this.#entries.set(key, value)
    return value
  }

  set(key: K, value: V): void {
    this.#entries.delete(key)
    this.#entries.set(key, value)
    if (this.#entries.size > this.capacity) {
      const oldest = this.#entries.keys().next()
      if (!oldest.done) this.#entries.delete(oldest.value)
    }
  }
}
