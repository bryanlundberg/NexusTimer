import { initializeApp } from 'firebase/app'
import { getFirestore } from '@firebase/firestore'
import { getDatabase } from '@firebase/database'
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_APP_ID || '',
  databaseURL: process.env.NEXT_PUBLIC_REALTIME || ''
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
