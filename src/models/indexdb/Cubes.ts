import { database } from '@/db/indexdb';
import BoxDB, { BoxData } from 'bxd';

const STORE_NAME = 'nx-data';

const cubeSchema = {
  id: {
    type: BoxDB.Types.STRING,
    key: true,
  },
  name: {
    type: BoxDB.Types.STRING,
    index: false,
  },
  category: {
    type: BoxDB.Types.STRING,
    index: true,
  },
  createdAt: {
    type: BoxDB.Types.NUMBER,
    index: true,
    defaultValue: Date.now(),
  },
  favorite: {
    type: BoxDB.Types.BOOLEAN,
    index: false,
    defaultValue: false,
  },
  solves: {
    type: BoxDB.Types.OBJECT,
    index: false,
    properties: {
      all: {
        type: BoxDB.Types.ARRAY,
        itemType: BoxDB.Types.OBJECT,
        itemProperties: {
          id: { type: BoxDB.Types.STRING, key: true },
          time: { type: BoxDB.Types.NUMBER },
          plus2: { type: BoxDB.Types.BOOLEAN, defaultValue: false },
          dnf: { type: BoxDB.Types.BOOLEAN, defaultValue: false },
          comment: { type: BoxDB.Types.STRING, defaultValue: '' },
          bookmark: { type: BoxDB.Types.BOOLEAN, defaultValue: false },
          scramble: { type: BoxDB.Types.STRING, defaultValue: '' },
          startTime: { type: BoxDB.Types.NUMBER, defaultValue: 0 },
          endTime: { type: BoxDB.Types.NUMBER, defaultValue: 0 },
        }
      },
      session: {
        type: BoxDB.Types.ARRAY,
        itemType: BoxDB.Types.OBJECT,
        itemProperties: {
          id: { type: BoxDB.Types.STRING, key: true },
          time: { type: BoxDB.Types.NUMBER },
          plus2: { type: BoxDB.Types.BOOLEAN, defaultValue: false },
          dnf: { type: BoxDB.Types.BOOLEAN, defaultValue: false },
          comment: { type: BoxDB.Types.STRING, defaultValue: '' },
          bookmark: { type: BoxDB.Types.BOOLEAN, defaultValue: false },
          scramble: { type: BoxDB.Types.STRING, defaultValue: '' },
          startTime: { type: BoxDB.Types.NUMBER, defaultValue: 0 },
          endTime: { type: BoxDB.Types.NUMBER, defaultValue: 0 },
        }
      }
    }
  },
} as const;

const Cubes = database.create(STORE_NAME, cubeSchema);

export type CubesType = BoxData<typeof cubeSchema>;
export default Cubes;
