"use client";

import { getLastBackupDate } from "@/actions/actions";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AccountLastBackup({ session }: { session: Session }) {
  const t = useTranslations("Index");
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchLastBackupDate = async () => {
      if (!session || !session.user || !session.user.email) return;
      const date = await getLastBackupDate({ email: session.user.email });
      setLastBackupDate(date ? date : "No backup found");
      setIsLoading(false);
    };

    fetchLastBackupDate();
  }, [session]);

  return (
    <>
      <div>
        {!isLoading
          ? t("SettingsPage.last-backup") + " " + lastBackupDate
          : t("SettingsPage.fetching-last-backup")}
      </div>
    </>
  );
}
