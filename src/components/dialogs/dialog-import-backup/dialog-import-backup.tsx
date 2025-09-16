import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useTimerStore } from '@/store/timerStore';
import importDataFromFile from '@/lib/importDataFromFile';
import Loading from '../../Loading';
import { useRouter } from 'next/navigation';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useNXData } from '@/hooks/useNXData';
import DialogImportReview from './dialog-import-review';
import { Cube } from '@/interfaces/Cube';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';

export default function DialogImportBackup() {
  const { getAllCubes, clearCubes, saveBatchCubes } = useNXData();
  const t = useTranslations('Index.backup-modal');
  const [isImporting, setIsImporting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [importCubes, setImportCubes] = useState<Cube[] | null>(null);
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube);
  const setCubes = useTimerStore((state) => state.setCubes);
  const router = useRouter();

  const handleImportBackup = async (file: File[]) => {
    if (file && file.length > 0) {
      try {
        setIsImporting(true);
        const response = await importDataFromFile(file[0]);
        if (response && !response?.length) return toast.error('No valid data found in the backup file.');
        if (response) {
          setImportCubes(response);
          setReviewOpen(true);
        }
      } catch (error) {
        toast.error('Backup import failed. Please try again.');

        console.error(error);
      } finally {
        setIsImporting(false);
      }
    }
  }

  const handleCancelReview = () => {
    setReviewOpen(false);
    setImportCubes(null);
  }

  const handleConfirmReview = async (editedCubes: Cube[]) => {
    try {
      setIsImporting(true);
      await clearCubes();
      await saveBatchCubes(editedCubes);
      toast.success('Backup imported successfully!');

      const cubesDB = await getAllCubes();
      setCubes(cubesDB);
      router.push('/cubes');
      setSelectedCube(null);
      toast.success('Import completed!');
    } catch (error) {
      toast.error('Backup import failed. Please try again.');
      console.error(error);
    } finally {
      setIsImporting(false);
      setReviewOpen(false);
      setImportCubes(null);
    }
  }

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-auto items-center justify-center">
            <DialogTitle>{t('title')}</DialogTitle>
          </div>
        </DialogHeader>
        {!isImporting ? (
          <Dropzone
            onDrop={handleImportBackup}
            onError={console.error}
            accept={{ 'application/txt' : ['.txt'] }}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        ) : (
          <div className="text-center mx-auto flex-col items-center gap-2">
            <div className="flex justify-center mt-3">
              <Loading/>
            </div>
            <div className="mx-auto mt-2">{t('loading-part-1')}</div>
            <div className="font-bold">{t('loading-part-2')}</div>
          </div>
        )}
        <div className="flex flex-auto items-center justify-center">
          <div className="font-medium mt-3">{t('welcome')}</div>
        </div>
        <DialogFooter>
          <ul className="flex items-center justify-center flex-auto gap-2">
            <div className="rounded-2xl bg-primary size-[64px] flex items-center justify-center">
              <Image src={"/logo.png"} alt={"logo"} width={48} height={48} draggable={false} className={"p-3 w-full h-full"} />
            </div>
            <Image
              src={'/timer-logos/cstimer.jpg'}
              alt="cstimer logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />

            <Image
              src={'/timer-logos/twistytimer.jpg'}
              alt="twistytimer logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />

            <Image
              src={'/timer-logos/cubedesk.jpg'}
              alt="cubedesk logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />
          </ul>
        </DialogFooter>
      </DialogContent>

      {importCubes && (
        <DialogImportReview
          open={reviewOpen}
          cubes={importCubes}
          onCancel={handleCancelReview}
          onConfirm={handleConfirmReview}
        />
      )}
    </>
  );
}
