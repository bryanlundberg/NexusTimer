import _, { uniqBy } from 'lodash';
import { Cube } from '@/interfaces/Cube';
import { formatCubesDatesAndOrder, importNexusTimerData } from '@/lib/importDataFromFile';
import { toast } from 'sonner';
import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate';
import { useNXData } from '@/hooks/useNXData';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useTimerStore } from '@/store/timerStore';
import { useUser } from '@/hooks/api/useUser';
import { useCallback, useState } from 'react';
import { useUploadThing } from '@/utils/uploadthing-helpers';
import { BackupLoadMode } from '@/enums/BackupLoadMode';
import { useSettingsModalStore } from '@/store/SettingsModalStore';

export const useSyncBackup = () => {
  const { clearCubes, getAllCubes, saveBatchCubes } = useNXData();
  const { data: session } = useSession();
  const router = useRouter();
  const setCubes = useTimerStore((state) => state.setCubes);
  const { data: user } = useUser(session?.user?.id!);
  const [isUploading, setIsUploading] = useState(false);
  const updateSetting = useSettingsModalStore(state => state.updateSetting)

  const { startUpload } = useUploadThing('backupUploader', {
    onClientUploadComplete: () => {
      setIsUploading(false);
      router.push('/account');
      toast.success('Backup saved successfully!');
    },
    onUploadError: (e) => {
      console.error(e);
      setIsUploading(false);
      toast.error('Error occurred while uploading');
    },
  });

  if (!session) redirect('/app');

  const handleUploadBackup = async () => {
    if (isUploading) return;
    setIsUploading(true);

    const cubes = await getAllCubes();

    if (!cubes || !session || !session.user || !session.user.id) {
      setIsUploading(false);
      return toast.error('Failed to retrieve cubes or session data.');
    }

    const text = JSON.stringify(cubes);

    const compressed = compressSync(strToU8(text));
    const blob = new Blob([compressed], { type: 'application/octet-stream' });
    const file = new File([blob], `${session.user.id}.txt`, { type: 'application/octet-stream' });

    try {
      await startUpload([file]);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      toast.error('Error occurred while uploading');
    }
  };

  const mergeAndUniqData = useCallback(async (backupData: Cube[], localCubesData: Cube[]) => {
    let newCubes = _.cloneDeep(localCubesData) as Cube[];

    for (let i = 0; i < backupData.length; i++) {
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
  }, []);

  const handleDownloadData = useCallback(async ({ mode }: {
    mode?: BackupLoadMode
  } = { mode: BackupLoadMode.MERGE }) => {
    if (!session || !session.user || !session.user.email) return;

    try {
      if (!user?.backup?.url) {
        toast.error('No backup found for this user.');
        return;
      }

      const doc = await fetch(`${user.backup.url}`);
      const compressed = new Uint8Array(await doc.arrayBuffer());

      const decompressed = decompressSync(compressed);
      const data = strFromU8(decompressed);

      const backupData = importNexusTimerData(data);
      const existingCubes = await getAllCubes();

      let newCubes: Cube[] = [];

      if (mode === BackupLoadMode.REPLACE) {
        newCubes = formatCubesDatesAndOrder(backupData);
      }

      if (mode === BackupLoadMode.MERGE) {
        newCubes = await mergeAndUniqData(backupData, existingCubes);
      }

      updateSetting('sync.lastSync', Date.now());
      updateSetting('sync.totalSolves', 0);

      await clearCubes();
      await saveBatchCubes(newCubes);
      setCubes(newCubes);
      router.push('/app');
      toast.success(mode === BackupLoadMode.REPLACE
        ? 'Backup replaced successfully!'
        : 'Backup merged successfully!'
      );

    } catch (error) {
      console.error('Error loading backup:', error);
    }
  }, [session, user, getAllCubes, mergeAndUniqData, updateSetting, clearCubes, saveBatchCubes, setCubes, router]);

  return {
    mergeAndUniqData,
    handleDownloadData,
    handleUploadBackup,
    isUploading,
  }
}
