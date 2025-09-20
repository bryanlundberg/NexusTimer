'use client';
import AccountHeader from '@/components/account/account-header/account-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useNXData } from '@/hooks/useNXData';
import { useUploadThing } from '@/utils/uploadthing-helpers';
import { compressSync, strToU8 } from 'fflate';

export default function Page() {
  const { getAllCubes } = useNXData();
  const { data: session } = useSession();
  const t = useTranslations('Index');
  const router = useRouter();

  const { startUpload } = useUploadThing('backupUploader', {
    onClientUploadComplete: () => {
      router.push('/account');
      toast.success('Backup saved successfully!');
    },
    onUploadError: (e) => {
      console.error(e);
      toast.error('Error occurred while uploading');
    },
  });

  if (!session) redirect('/app');

  const handleBackup = async () => {
    const cubes = await getAllCubes();

    if (!cubes || !session || !session.user || !session.user.id) {
      return toast.error('Failed to retrieve cubes or session data.');
    }

    const text = JSON.stringify(cubes);

    const compressed = compressSync(strToU8(text));
    const blob = new Blob([compressed], { type: "application/octet-stream" });
    const file = new File([blob], `${session.user.id}.txt`, { type: "application/octet-stream" });

    await startUpload([file]);
  };

  return (
    <>
      <AccountHeader back="/app" label={t('SettingsPage.save-data-title')}/>
      <Card className="p-3 bg-secondary/10">
        <p>{t('SettingsPage.save-data-description')}</p>
        <p className="text-yellow-600">{t('SettingsPage.save-data-warning')}</p>
        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link href={'/account'} className="grow">
            <Button variant={'secondary'} className="w-full">
              {t('Inputs.back')}
            </Button>
          </Link>
          <Button
            className="grow"
            onClick={handleBackup}
          >
            {t('Inputs.continue')}
          </Button>
        </div>
      </Card>
    </>
  );
}
