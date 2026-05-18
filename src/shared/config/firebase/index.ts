import { initializeApp } from 'firebase/app'
import { getFirestore } from '@firebase/firestore'
import { getDatabase, connectDatabaseEmulator } from '@firebase/database'

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_REALTIME
})

export const db = getFirestore(app)
export const rtdb = getDatabase(app)

if (process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === 'true') {
  try {
    connectDatabaseEmulator(rtdb, 'localhost', 9000)
  } catch {}
}
