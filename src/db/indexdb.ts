import BoxDB from 'bxd';

const VERSION = 5;
const DB_NAME = 'IDBWrapper-nx-data';

export const database = new BoxDB(DB_NAME, VERSION);
