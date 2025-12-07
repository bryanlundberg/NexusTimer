import { database } from '@/shared/config/indexdb/indexdb'

const STORE_NAME = 'nx-images'

const SettingsIndexdb = database.create(STORE_NAME)

export default SettingsIndexdb
