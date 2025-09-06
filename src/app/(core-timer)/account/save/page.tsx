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
import { importNexusTimerData } from '@/lib/importDataFromFile';
import _ from 'lodash';
import { useTimerStore } from '@/store/timerStore';

export default function Page() {
  const { getAllCubes } = useNXData();
  const { data: session } = useSession();
  const t = useTranslations('Index');
  const router = useRouter();
  if (!session) redirect('/settings');
  const { saveBatchCubes } = useNXData();
  const setCubes = useTimerStore((state) => state.setCubes);

  const handleBackup = async () => {
    let cubes = await getAllCubes();

    try {
       importNexusTimerData(JSON.stringify(cubes));
    } catch (error) {
      // This workaround is needed because some users have already created backups with these incorrectly stored times, (startTime = null);
      cubes = _.map(cubes, (cube) => {
        return {
          ...cube,
          solves: {
            ...cube.solves,
            session: cube.solves.session.map((solve) => {
              return {
                ...solve,
                startTime: solve.startTime !== null && solve.startTime !== undefined
                  ? solve.startTime
                  : solve.endTime - (solve.time + (solve.plus2 ? 2000 : 0)),
              }
            }),
            all: cube.solves.all.map((solve) => {
              return {
                ...solve,
                startTime: solve.startTime !== null && solve.startTime !== undefined
                  ? solve.startTime
                  : solve.endTime - (solve.time + (solve.plus2 ? 2000 : 0)),
              }
            })
          }
        };
      })

      await saveBatchCubes(cubes)
      setCubes(cubes);
    }

    if (!cubes || !session || !session.user || typeof session.user.email !== 'string') {
      return toast.error('Failed to retrieve cubes or session data.');
    }

    try {
      const response = await fetch('/api/v1/backups', {
        method: 'POST',
        body: JSON.stringify({
          _id: session.user.id,
          data: JSON.stringify(cubes),
        }),
      });

      if (!response.ok) {
        return toast.error('Failed to save backup.');
      }

      router.push('/');
      toast.success('Backup saved successfully!');
    } catch (error) {
      console.error('Error saving backup:', error);
      toast.error('Failed to save backup.');
    }
  }

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
