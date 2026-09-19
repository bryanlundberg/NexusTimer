import { openDB, IDBPDatabase, IDBPTransaction } from 'idb'
import { normalizeCubeSolves } from '@/entities/cube/lib/normalizeCubeSolves'

const VERSION = 6
const DB_NAME = 'IDBWrapper-nx-data'

type AnyDB = IDBPDatabase<any> | null

class IDBWrapper {
  public ready = false
  private db: AnyDB = null

  async open() {
    if (this.ready && this.db) return
    this.db = await openDB(DB_NAME, VERSION, {
      upgrade: (db, oldVersion, _newVersion, transaction) => {
        if (!db.objectStoreNames.contains('nx-data')) {
          db.createObjectStore('nx-data', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('nx-images')) {
          db.createObjectStore('nx-images', { keyPath: 'name' })
        }
        if (oldVersion > 0 && oldVersion < 6) {
          void sortStoredSolves(transaction)
        }
      },
      blocking: () => {
        this.db?.close()
        this.db = null
        this.ready = false
      }
    })
    this.ready = true
  }

  create(storeName: string, _schema?: unknown) {
    const ensureOpen = async () => {
      if (!this.ready) await this.open()
    }

    return {
      get: async (key: IDBValidKey) => {
        await ensureOpen()
        return await this.db!.get(storeName, key)
      },
      add: async (value: any) => {
        await ensureOpen()
        return await this.db!.add(storeName, value)
      },
      put: async (value: any) => {
        await ensureOpen()
        return await this.db!.put(storeName, value)
      },
      delete: async (key: IDBValidKey) => {
        await ensureOpen()
        return await this.db!.delete(storeName, key)
      },
      clear: async () => {
        await ensureOpen()
        return await this.db!.clear(storeName)
      },
      replaceAll: async (values: any[]) => {
        await ensureOpen()
        const tx = this.db!.transaction(storeName, 'readwrite')
        await Promise.all([tx.store.clear(), ...values.map((value) => tx.store.put(value)), tx.done])
      },
      find: () => ({
        get: async () => {
          await ensureOpen()
          return await this.db!.getAll(storeName)
        }
      })
    }
  }
}

export async function sortStoredSolves(transaction: IDBPTransaction<any, string[], 'versionchange'>) {
  let cursor = await transaction.objectStore('nx-data').openCursor()
  while (cursor) {
    let normalized = cursor.value
    try {
      normalized = normalizeCubeSolves(cursor.value)
    } catch {}
    if (normalized !== cursor.value) await cursor.update(normalized)
    cursor = await cursor.continue()
  }
}

export const database = new IDBWrapper()
