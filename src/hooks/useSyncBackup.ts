import _, { uniqBy } from 'lodash';
import { Cube } from '@/interfaces/Cube';
import { formatCubesDatesAndOrder } from '@/lib/importDataFromFile';

export const useSyncBackup = () => {
  const syncBackup = async (backupData: Cube[], localCubesData: Cube[]) => {

    let newCubes = _.cloneDeep(localCubesData) as Cube[];

    for(let i = 0; i < backupData.length; i++) {
      const backupCube = backupData[i];
      const existingCube = newCubes.find(cube => cube.id === backupCube.id);

      if (existingCube) {
        newCubes[newCubes.indexOf(existingCube)].solves = {
          session: uniqBy([...existingCube.solves.session, ...backupCube.solves.session], 'id'),
          all: uniqBy([...existingCube.solves.all, ...backupCube.solves.all], 'id'),
        }
      } else {
        newCubes.push(backupCube);
      }
    }

    return formatCubesDatesAndOrder(newCubes);
  }

  return {
    syncBackup,
  }
}
