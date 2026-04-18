import mongoose from 'mongoose'
import dns from 'node:dns'
import '../../../entities/user/model/user'
import '../../../entities/solve/model/solve'
import '../../../entities/backup/model/backup'

// Node 22+ on Windows sometimes can't querySrv Atlas via system DNS (ECONNREFUSED).
// Force public resolvers so the mongodb+srv lookup works regardless of OS config.
dns.setServers(['1.1.1.1', '1.0.0.1'])

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return true
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    return true
  } catch (error) {
    console.error(error)
  }
}

export default connectDB
