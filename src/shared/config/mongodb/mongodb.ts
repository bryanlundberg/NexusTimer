import mongoose from 'mongoose'

const connectDB = async () => {
  if (mongoose.connections[0].readyState === 1) {
    return true
  }

  if (mongoose.connections[0].readyState !== 0) {
    await mongoose.disconnect()
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    return true
  } catch (error) {
    console.error(error)
  }
}

export default connectDB
