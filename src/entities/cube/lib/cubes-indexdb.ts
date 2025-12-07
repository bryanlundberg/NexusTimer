import { database } from '@/shared/config/indexdb/indexdb'

const STORE_NAME = 'nx-data'

const CubesIndexdb = database.create(STORE_NAME)

export default CubesIndexdb
