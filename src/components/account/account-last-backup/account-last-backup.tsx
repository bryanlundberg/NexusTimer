"use client";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import moment from 'moment';
import { useBackup } from "@/hooks/api/useBackup";

export default function AccountLastBackup({ session }: { session: Session }) {
  const t = useTranslations('Index');
  const { backup, isLoading } = useBackup(session.user.id);

  return (
    <>
      <div>
        {!isLoading
          ? t('SettingsPage.last-backup') +
          ' ' +
          (backup && backup !== 'No backup found'
            ? moment(backup.createdAt).format('DD/MMMM/YYYY HH:mm:ss')
            : backup)
          : t('SettingsPage.fetching-last-backup')}
      </div>
    </>
  );
}
