'use client';
import AccountHeader from '@/components/account/account-header/account-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useSyncBackup } from '@/hooks/useSyncBackup';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Page() {
  const t = useTranslations('Index');
  const { handleUploadBackup, isUploading, uploadCompleted } = useSyncBackup();
  const router = useRouter();

  useEffect(() => {
    if (uploadCompleted) {
      router.push('/account');
      toast.success('Data uploaded successfully');
    }
  }, [router, uploadCompleted]);

  return (
    <>
      <AccountHeader back="/app" label={t('SettingsPage.save-data-title')}/>
      <Card className="p-3 bg-secondary/10" aria-busy={isUploading}>
        <p>{t('SettingsPage.save-data-description')}</p>
        <p className="text-yellow-600">{t('SettingsPage.save-data-warning')}</p>
        <div className="flex gap-2 w-full justify-between mt-5 flex-col-reverse sm:flex-row">
          <Link
            href={'/account'}
            className="grow"
            onClick={(e) => {
              if (isUploading) {
                e.preventDefault();
              }
            }}
            aria-disabled={isUploading}
          >
            <Button variant={'secondary'} className="w-full" disabled={isUploading}>
              {t('Inputs.back')}
            </Button>
          </Link>
          <Button
            className="grow"
            onClick={handleUploadBackup}
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin"/>
                <span>{t('Inputs.continue')}</span>
              </span>
            ) : (
              t('Inputs.continue')
            )}
          </Button>
        </div>
      </Card>
    </>
  );
}
