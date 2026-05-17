import { setServers } from 'node:dns'
setServers(['8.8.8.8', '1.1.1.1'])

import mongoose from 'mongoose'
import '../../../entities/user/model/user'
import '../../../entities/solve/model/solve'
import '../../../entities/backup/model/backup'
import '../../../entities/trainer-solve/model/trainer-solve'
import '../../../entities/trainer-stats/model/trainer-stats'
import '../../../entities/log/model/log'

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
