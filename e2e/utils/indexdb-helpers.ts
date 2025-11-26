import { Page } from '@playwright/test'

export async function getIndexedDBData(
  page: Page,
  dbName: string = 'IDBWrapper-nx-data',
  storeName: string = 'nx-data'
): Promise<any[]> {
  return await page.evaluate(
    async ({ dbName, storeName }) => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName)

        request.onerror = () => reject('Error opening DB')

        request.onsuccess = () => {
          const db = request.result
          const tx = db.transaction(storeName, 'readonly')
          const store = tx.objectStore(storeName)
          const getAll = store.getAll()

          getAll.onsuccess = () => resolve(getAll.result)
          getAll.onerror = () => reject(getAll.error)
        }
      })
    },
    { dbName, storeName }
  )
}

export async function getIndexedDBItem(
  page: Page,
  key: string | number,
  dbName: string = 'IDBWrapper-nx-data',
  storeName: string = 'nx-data'
): Promise<any> {
  return await page.evaluate(
    async ({ dbName, storeName, key }) => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName)

        request.onerror = () => reject('Error opening DB')

        request.onsuccess = () => {
          const db = request.result
          const tx = db.transaction(storeName, 'readonly')
          const store = tx.objectStore(storeName)
          const get = store.get(key)

          get.onsuccess = () => resolve(get.result)
          get.onerror = () => reject(get.error)
        }
      })
    },
    { dbName, storeName, key }
  )
}

export async function clearIndexedDBStore(
  page: Page,
  dbName: string = 'IDBWrapper-nx-data',
  storeName: string = 'nx-data'
): Promise<void> {
  return await page.evaluate(
    async ({ dbName, storeName }) => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName)

        request.onerror = () => reject('Error opening DB')

        request.onsuccess = () => {
          const db = request.result
          const tx = db.transaction(storeName, 'readwrite')
          const store = tx.objectStore(storeName)
          const clear = store.clear()

          clear.onsuccess = () => resolve()
          clear.onerror = () => reject(clear.error)
        }
      })
    },
    { dbName, storeName }
  )
}
