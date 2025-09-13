import { openDB, IDBPDatabase } from 'idb';

const VERSION = 5;
const DB_NAME = 'IDBWrapper-nx-data';

type AnyDB = IDBPDatabase<any> | null;

class IDBWrapper {
  public ready = false;
  private db: AnyDB = null;

  async open() {
    if (this.ready && this.db) return;
    this.db = await openDB(DB_NAME, VERSION, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains('nx-data')) {
          db.createObjectStore('nx-data', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('nx-images')) {
          db.createObjectStore('nx-images', { keyPath: 'name' });
        }
      },
    });
    this.ready = true;
  }

  create(storeName: string, _schema?: unknown) {
    const ensureOpen = async () => {
      if (!this.ready) await this.open();
    };

    return {
      get: async (key: IDBValidKey) => {
        await ensureOpen();
        return await this.db!.get(storeName, key);
      },
      add: async (value: any) => {
        await ensureOpen();
        return await this.db!.add(storeName, value);
      },
      put: async (value: any) => {
        await ensureOpen();
        return await this.db!.put(storeName, value);
      },
      delete: async (key: IDBValidKey) => {
        await ensureOpen();
        return await this.db!.delete(storeName, key);
      },
      clear: async () => {
        await ensureOpen();
        return await this.db!.clear(storeName);
      },
      find: () => ({
        get: async () => {
          await ensureOpen();
          return await this.db!.getAll(storeName);
        },
      }),
    };
  }
}

export const database = new IDBWrapper();
