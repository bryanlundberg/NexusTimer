import { database } from '@/shared/config/indexdb/indexdb'

const STORE_NAME = 'nx-data'

const Cubes = database.create(STORE_NAME)

export default Cubes
