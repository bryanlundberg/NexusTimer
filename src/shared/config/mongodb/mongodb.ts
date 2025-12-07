import mongoose from 'mongoose'
import '../../../entities/user/model/user'
import '../../../entities/solve/model/solve'
import '../../../entities/backup/model/backup'

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return true
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    return true
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
