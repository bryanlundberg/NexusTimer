import mongoose from 'mongoose'
import { MONGODB_URI } from 'astro:env/server'

let connection: Promise<typeof mongoose> | null = null

export function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose)
  if (!connection) {
    connection = mongoose.connect(MONGODB_URI).catch((error) => {
      connection = null
      throw error
    })
  }
  return connection
}
